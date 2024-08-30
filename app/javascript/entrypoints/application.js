// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>
console.log('Vite ⚡️ Rails')

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>

console.log('Visit the guide for more information: ', 'https://vite-ruby.netlify.app/guide/rails')

// Example: Load Rails libraries in Vite.
//
// import * as Turbo from '@hotwired/turbo'
// Turbo.start()
//
// import ActiveStorage from '@rails/activestorage'
// ActiveStorage.start()
//
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'

import { Application } from "@hotwired/stimulus";
import { registerControllers } from "stimulus-vite-helpers";

// Start the Stimulus application
const application = Application.start();

// Enable debug mode and warnings in development environment
application.debug = process.env.NODE_ENV === "development";
application.warnings = true;

// Expose the Stimulus application to the global window object
window.Stimulus = application;

// Import and register all Stimulus controllers
try {
  const controllers = import.meta.glob("~/controllers/**/*_controller.js", {
    eager: true,
  });
  registerControllers(application, controllers);
} catch (error) {
  console.error("Error registering Stimulus controllers:", error);
}