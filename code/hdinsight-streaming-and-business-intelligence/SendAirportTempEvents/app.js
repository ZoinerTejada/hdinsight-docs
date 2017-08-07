var https = require('https');
var crypto = require('crypto');
var moment = require('moment');

// Event Hub Namespace
var namespace = 'YOUR_NAMESPACE';
// Event Hub Name
var hubname ='sensordata';
// Shared access Policy name and key (from Event Hub configuration)
var my_key_name = 'devices';
var my_key = 'YOUR_KEY';

// Configure whether to send events in batches or one at a time
var send_as_batch = false;

// Full URI to send messages to the hub
var my_uri = 'https://' + namespace + '.servicebus.windows.net' + '/' + hubname + '/messages';

// Evaluate process arguments:
var arg_batch = process.argv[2];
if (arg_batch === '-batch') {
	send_as_batch = true;
}

// Create singleton EventHub controller to control the rate at which single
// payloads are sent to the Event Hub API. Used for this dev environment to
// prevent request timeouts.
function EventHubController(timeout) {
  this.timeout = timeout || 125;
  this.queue = [];
  this.ready = true;
}

EventHubController.prototype.send = function(body, callback) {
  send_single(body);
  if (callback) callback();
};

EventHubController.prototype.exec = function() {
  this.queue.push(arguments);
  this.process();
};

EventHubController.prototype.process = function() {
  if (this.queue.length === 0) return;
  if (!this.ready) return;
  var self = this;
  this.ready = false;
  this.send.apply(this, this.queue.shift());
  setTimeout(function () {
    self.ready = true;
    self.process();
  }, this.timeout);
};

var EventHub = new EventHubController();

// Create a SAS token
// See http://msdn.microsoft.com/library/azure/dn170477.aspx

function create_sas_token(uri, key_name, key)
{
	// Token expires in three hours
	var expiry = moment().add(3, 'hours').unix();

	var string_to_sign = encodeURIComponent(uri) + '\n' + expiry;
	var hmac = crypto.createHmac('sha256', key);
	hmac.update(string_to_sign);
	var signature = hmac.digest('base64');
	var token = 'SharedAccessSignature sr=' + encodeURIComponent(uri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + key_name;

	return token;
}

function send_single(payload)
{
	console.log(payload);

	// Send the request to the Event Hub
	var options = {
		hostname: namespace + '.servicebus.windows.net',
		port: 443,
		path: '/' + hubname + '/messages',
		method: 'POST',
		headers: {
			'Authorization': my_sas,
			'Content-Length': payload.length,
			'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
		}
	};

	var req = https.request(options, function(res) {
		//console.log("statusCode: ", res.statusCode);
		//console.log("headers: ", res.headers);

		res.on('data', function(d) {
			process.stdout.write(d);
			});
	});

	req.on('error', function(e) {
		console.error('Error sending payload to Event Hubs: ' + e);
	});

	req.write(payload);
	req.end();
}

function send_batch(payload)
{
	// Send the request to the Event Hub
	var options = {
		hostname: namespace + '.servicebus.windows.net',
		port: 443,
		path: '/' + hubname + '/messages',
		method: 'POST',
		headers: {
			'Authorization': my_sas,
			//'Content-Length': payload.length,
			'Content-Type': 'application/vnd.microsoft.servicebus.json'
		}
	};

	var req = https.request(options, function(res) {
		console.log("statusCode: ", res.statusCode);
		//console.log("headers: ", res.headers);

		res.on('data', function(d) {
			process.stdout.write(d);
			});
	});

	req.on('error', function(e) {
		console.error('Error sending payload to Event Hubs: ' + e);
	});

	req.write(payload);
	req.end();
}

// Define a Device class to hold device data
function Device(id, ambient, delta, firstFlight, lastFlight) {
	this.deviceId = id;
	this.ambientTemp = ambient;
	this.deltaTempPreFlight = delta;
	this.nextDepartureIntervalNumber = firstFlight;
	this.lastDepartureHour = lastFlight;
	this.temp = ambient;
}

// Create the shared access signature for authentication
var my_sas = create_sas_token(my_uri, my_key_name, my_key)

// Schedule for 24 hours
// Rooms start at ambient temperature (such as 65 F) of airport
// Depending on the room, first flight at 6 am, last flight at 11pm
// Flights arrive every every 90
// 24x60x60 / 10 = 8640 data points * # of devices
// 30 minutes before flight people arrive, temp starts to rise due to warm from bodies (rise 5 degrees or more, depending on number of people)
// 30 minutes after flight arrives folks are boarded, and temp starts to drop towards ambient temperature

var reportingIntervalSeconds = 10;
var minutesBetweenFlights = 90;
var numDataPointsPerDay = (24 * 60 * 60) / reportingIntervalSeconds;
var timeStamp = moment().utc().startOf('day'); // Get beginning of the day as a moment
//timeStamp.subtract(2, 'days');

/** Variables for tracking just an individual device **/
// First flight at 6 am
//var nextDepartureIntervalNumber = (6 * 60 * 60) / reportingIntervalSeconds;
//var deltaTempPreFlight = 5;
//var ambientTemp = 65;
//var lastDepartureHour = 23; //hour 23 is 11pm
//var temp = ambientTemp;

var devices = [];
var datapoints = [];

// Define our devices
// Device 1 has flights from 6:00 am until 11 pm. Its ambient temperature is 65 and fluctuates by 5 degrees, based on crowd size.
devices.push(new Device("1", 65, 5, (6 * 60 * 60) / reportingIntervalSeconds, 23));
// Device 2 has flights from 5:00 am until 11 pm. Its ambient temperature is 65 and fluctuates by 10 degrees, based on crowd size.
devices.push(new Device("2", 65, 10, (5 * 60 * 60) / reportingIntervalSeconds, 23));
// Device 3 has flights from 6:30 am until 12 am. Its ambient temperature is 62 and fluctuates by 8 degrees, based on crowd size.
devices.push(new Device("3", 62, 5, (6.5 * 60 * 60) / reportingIntervalSeconds, 24));

// Send a message for each device (i = 0 means midnight)
for(var i = 0; i < numDataPointsPerDay; i++)
{
	// Prepare the time of the next event
	timeStamp.add(reportingIntervalSeconds, 'seconds');

	for(var d = 0; d < devices.length; d++) {
		processAndSendEventData(devices[d], i);
	}
}

console.log('Finished sending events');

function processAndSendEventData(device, dataPointNumber) {
	// Set temperature value
	if (isWithinPreFlightWindow(dataPointNumber, reportingIntervalSeconds, device.nextDepartureIntervalNumber)) {
		device.temp += device.deltaTempPreFlight / ((30 * 60) / reportingIntervalSeconds);
	}
	else if (isWithinPostFlightWindow(dataPointNumber, reportingIntervalSeconds, device.nextDepartureIntervalNumber)) {
		device.temp -= device.deltaTempPreFlight / ((30 * 60) / reportingIntervalSeconds);
	}
	else {
		device.temp = device.ambientTemp;
	}

	// Set a time for the next departure
	if (hasPlaneDeparted(dataPointNumber, reportingIntervalSeconds, device.nextDepartureIntervalNumber)) {
		device.nextDepartureIntervalNumber += ((minutesBetweenFlights * 60) / reportingIntervalSeconds); 

		// e.g., last flight departs at 11 pm
		if ((device.nextDepartureIntervalNumber * reportingIntervalSeconds) >= (device.lastDepartureHour * (60 * 60))) {
			// Set the departure to a number in a future day we won't reach
			device.nextDepartureIntervalNumber = ((30 * 60 * 60) / reportingIntervalSeconds); 
		}
	}
	
	var body = JSON.stringify({"TimeStamp": timeStamp.format(), "DeviceId": device.deviceId, "Temperature":device.temp});

	if (!send_as_batch) {
		// Send single request:
		EventHub.exec(body);
	}
	else {
		// Send as a batch:
		datapoints.push({"Body": body});
		if (datapoints.length >= 500 || dataPointNumber >= numDataPointsPerDay-1) {
			var payload = JSON.stringify(datapoints);
			console.log('Sending batch payload: ');
			console.log(payload);
			send_batch(payload);
			// Clear the array
			datapoints = [];
		}
	}
}

function isWithinPreFlightWindow(intervalNumber, reportingInterval, departureIntervalNumber) {
	//Pre-flight window is 30 minutes before departure
	if ((intervalNumber * reportingInterval) >= (departureIntervalNumber * reportingInterval) - (30*60) &&
		(intervalNumber * reportingInterval) < (departureIntervalNumber * reportingInterval)) {
		return true;
	}

	return false;
}

function isWithinPostFlightWindow(intervalNumber, reportingInterval, departureIntervalNumber) {
	//Post-Flight window lasts from departure to 30 minutes after
	if ((intervalNumber * reportingInterval) >= (departureIntervalNumber * reportingInterval)  &&
		(intervalNumber * reportingInterval) < (departureIntervalNumber * reportingInterval) + (30 * 60)) {
		return true;
	}

	return false;
}

function hasPlaneDeparted(intervalNumber, reportingInterval, departureIntervalNumber) {
	if ((intervalNumber * reportingInterval) > (departureIntervalNumber * reportingInterval) + (30 * 60)) {
		return true;
	}
	return false;
}