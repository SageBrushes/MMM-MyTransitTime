const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({
	socketNotificationReceived: function(notification, payload) {
		if (notification === "GET_TRANSIT_TIME") {
			console.log("[MMM-MyTransitTime] Received GET_TRANSIT_TIME notification.");
			const { apiKey, origin, destination, mode } = payload;
			const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&transit_mode=subway&key=${apiKey}`;

			console.log("[MMM-MyTransitTime] Requesting data from API URL:", apiUrl);

			request(apiUrl, (error, response, body) => {
				if (!error && response.statusCode == 200) {
					console.log("[MMM-MyTransitTime] Successful response from Google Maps API.");

					// Log the API response data
					console.log("[MMM-MyTransitTime] API Response Data:", body);

					const data = JSON.parse(body);
					if (data.routes[0] && data.routes[0].legs[0]) {
						const transitTime = data.routes[0].legs[0].duration.text;

						const transitSteps = data.routes[0].legs[0].steps.map(step => {
							if (step.travel_mode === "WALKING") {
								return `${step.travel_mode}: Walk for ${step.distance.text} (${step.duration.text})`;
							} else if (step.travel_mode === "TRANSIT") {
								return `${step.travel_mode}: Take ${step.transit_details.line.name} from ${step.transit_details.departure_stop.name} to ${step.transit_details.arrival_stop.name} (${step.distance.text}, ${step.duration.text})`;
							}
						});

						console.log("[MMM-MyTransitTime] Transit steps:", transitSteps);
						console.log("[MMM-MyTransitTime] Sending transit details to frontend.");
						this.sendSocketNotification("TRANSIT_TIME_RESULT", {
							transitTime: transitTime,
							transitDetails: transitSteps
						});
					} else {
						console.error("[MMM-MyTransitTime] No routes or legs found in API response.");
					}
				} else {
					console.error("[MMM-MyTransitTime] Error fetching transit time:", error);
				}
			});
		}
	}
});
