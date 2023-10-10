# MMM-MyTransitTime

A MagicMirror module that displays the estimated transit time from a specified origin to a destination, with detailed transit information.

![Screenshot of MMM-MyTransitTime](modules/MMM-MyTransitTime/example.png)

## Prerequisites

Before you begin, ensure you have access to the following:
- **Google Maps Directions API Key**: The module uses the Google Maps Directions API to fetch transit times. You can obtain your API key [here](https://cloud.google.com/maps-platform/docs/getting-started).

## Installation

1. Navigate to your MagicMirror's `modules` folder with `cd ~/MagicMirror/modules/`.
2. Clone this module by running git clone https://github.com/YourGithubUsername/MMM-MyTransitTime.git
3. Navigate to the MMM-MyTransitTime folder and npm install

## Configuration

Add the following configuration block to the modules array in your config/config.js file:

{
  module: "MMM-MyTransitTime",
  position: "top_right", // Adjust this to your preference
  config: {
    apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    origin: "YOUR_ORIGIN_ADDRESS",
    destination: "YOUR_DESTINATION_ADDRESS",
    mode: "transit",
    interval: 60000, // 1 minute
    showTransitDetails: true,
    customLabel: "Estimated Time to Get to Work"
  }
}
## Configuration Options

Option	Description
apiKey	Required Your Google Maps API key.
origin	Required The starting address for your route.
destination	Required The end address for your route.
mode	Transportation mode. Default is transit.
interval	Update frequency in milliseconds. Default is 60000 (1 minute).
showTransitDetails	Display step-by-step transit details if set to true. Default is true.
customLabel	Custom label for the module. Default is Estimated Time to Get to Work.

## Usage

After adding the module to your config.js file, simply run the MagicMirror application. The module will display the estimated transit time and, if showTransitDetails is enabled, detailed transit steps.

Contributing

Contributions are always welcome! If you'd like to contribute, please fork the repository and make your changes, then open a pull request.





