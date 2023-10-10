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

## Configuration options

| Option               | Description  |
|----------------------|--------------|
| `apiKey`             | Your Google Maps API key. **Required** |
| `origin`             | The starting address for your route. Example: `"YOUR_ORIGIN_ADDRESS"`. **Required** |
| `destination`        | The destination address for your route. Example: `"YOUR_DESTINATION_ADDRESS"`. **Required** |
| `mode`               | Mode of transportation. Default: `"transit"`. |
| `interval`           | How often the module should update its data, in milliseconds. Default: `60000` (1 minute). |
| `showTransitDetails` | If set to `true`, the module will display step-by-step transit details. Default: `true`. |
| `customLabel`        | Custom label for the module. Default: `"Estimated Time to Get to Work"`. |
| `debounceDelay`      | Debounce delay in milliseconds. Default: `10000` (10 seconds). |

### Example:

```javascript
{
    module: "MMM-MyTransitTime",
    position: "top_right",
    config: {
        apiKey: "YOUR_API_KEY",
        origin: "123 Main St, SomeCity, SomeCountry",
        destination: "456 Elm St, AnotherCity, AnotherCountry",
        mode: "transit",
        interval: 60000,
        showTransitDetails: true,
        customLabel: "Time to Work",
        debounceDelay: 10000
    }
}

## Usage

After adding the module to your config.js file, simply run the MagicMirror application. The module will display the estimated transit time and, if showTransitDetails is enabled, detailed transit steps.

## Contributing

Contributions are always welcome! If you'd like to contribute, please fork the repository and make your changes, then open a pull request.





