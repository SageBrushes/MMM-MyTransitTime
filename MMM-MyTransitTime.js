Module.register("MMM-MyTransitTime", {
  // Default module config.
  defaults: {
	apiKey: "YOUR_API_KEY",
	origin: "YOUR_ORIGIN_ADDRESS",
	destination: "YOUR_DESTINATION_ADDRESS",
	mode: "transit",
	interval: 60000, // 1 minute
	showTransitDetails: true, // Set to true to display step-by-step transit details
	customLabel: "Estimated Time to Get to Work", // Custom label for the module
	debounceDelay: 10000, // 10 seconds by default, adjust as needed
  },

  // Initialize the module.
  start: function () {
	console.log("[MMM-MyTransitTime] Starting module: " + this.name);

	this.transitTime = null;

	// Define a function to fetch transit data with debouncing
	this.fetchTransitData = this.debounce(this.fetchTransitData, this.config.debounceDelay);

	// Schedule the first update.
	this.scheduleUpdate();
  },

// Override dom generator.
  getDom: function () {
	const wrapper = document.createElement("div");
	wrapper.className = "my-transit-time";

	if (this.transitTime) {
	  const timeElement = document.createElement("div");
	  timeElement.className = "transit-time right-aligned"; // Add a class for right alignment
	  timeElement.textContent = `Transit Time: ${this.transitTime}`;
	  wrapper.appendChild(timeElement);

	  if (this.config.showTransitDetails && this.transitDetails) {
		const detailsList = document.createElement("ul");
		detailsList.className = "transit-details";

		this.transitDetails.forEach((detail) => {
		  const listItem = document.createElement("li");

		  if (detail.includes("WALKING")) {
			const walkingIcon = document.createElement("i");
			walkingIcon.className = "fas fa-walking"; // FontAwesome walking icon
			listItem.appendChild(walkingIcon);
		  } else if (detail.includes("TRANSIT")) {
			const transitIcon = document.createElement("img");
			transitIcon.src = this.getGoogleTransitIcon(detail); // Get the train line icon from Google API data
			transitIcon.className = "mta-subway-icon"; // Add a class for styling
			listItem.appendChild(transitIcon);
		  }

		  listItem.textContent = detail;
		  detailsList.appendChild(listItem);
		});

		wrapper.appendChild(detailsList);
	  }
	} else {
	  const errorMessage = document.createElement("div");
	  errorMessage.className = "error-message";
	  errorMessage.textContent = "No transit data available.";
	  wrapper.appendChild(errorMessage);
	}

	return wrapper;
  },

  // Helper function to extract Google transit icon from detail
  getGoogleTransitIcon: function (detail) {
	const icon = detail.match(/icon:(.*?),/);
	if (icon) {
	  return icon[1].trim();
	}
	return "";
  },


  // Override notification handler.
  notificationReceived: function (notification, payload, sender) {
	if (notification === "DOM_OBJECTS_CREATED") {
	  console.log("[MMM-MyTransitTime] DOM objects are ready, triggering the first update.");
	  // DOM objects are ready, trigger the first update.
	  this.sendSocketNotification("GET_TRANSIT_TIME", this.config);
	}
  },

  // Override socket notification handler.
  socketNotificationReceived: function (notification, payload) {
	if (notification === "TRANSIT_TIME_RESULT") {
	  console.log("[MMM-MyTransitTime] Received TRANSIT_TIME_RESULT notification.");
	  this.transitTime = payload.transitTime;
	  this.transitDetails = payload.transitDetails;

	  this.updateDom();

	  // Schedule the next update.
	  this.scheduleUpdate();
	}
  },

  // Schedule the next update.
  scheduleUpdate: function () {
	var self = this;
	setInterval(function () {
	  console.log("[MMM-MyTransitTime] Scheduling the next update.");
	  // Call the debounced function to fetch transit data
	  self.fetchTransitData();
	}, this.config.interval);
  },

  // Fetch transit data from the Google API.
  fetchTransitData: function () {
	const { apiKey, origin, destination, mode } = this.config;
	const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&transit_mode=subway&key=${apiKey}`;

	// Make an HTTP request to the API
	fetch(apiUrl)
	  .then((response) => {
		if (!response.ok) {
		  throw new Error("Network response was not ok");
		}
		return response.json();
	  })
	  .then((data) => {
		// Process the API response and extract transit information
		const transitTime = data.routes[0].legs[0].duration.text;
		const transitSteps = data.routes[0].legs[0].steps.map((step) => {
		  if (step.travel_mode === "WALKING") {
			return `${step.travel_mode}: Walk for ${step.distance.text} (${step.duration.text})`;
		  } else if (step.travel_mode === "TRANSIT") {
			return `${step.travel_mode}: Take ${step.transit_details.line.name} from ${step.transit_details.departure_stop.name} to ${step.transit_details.arrival_stop.name} (${step.distance.text}, ${step.duration.text})`;
		  }
		});

		// Send the transit information to the front-end
		this.sendSocketNotification("TRANSIT_TIME_RESULT", {
		  transitTime: transitTime,
		  transitDetails: transitSteps,
		});
	  })
	  .catch((error) => {
		console.error("[MMM-MyTransitTime] Error fetching transit data:", error);
	  });
  },

  // Debounce function to limit the rate of API requests.
  debounce: function (func, delay) {
	var timeout;
	return function () {
	  var context = this;
	  var args = arguments;
	  clearTimeout(timeout);
	  timeout = setTimeout(function () {
		func.apply(context, args);
	  }, delay);
	};
  },
});
