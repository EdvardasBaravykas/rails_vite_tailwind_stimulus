
This repository provides a boilerplate for Ruby on Rails applications, 
pre-configured with Vite for modern asset bundling and Tailwind CSS for utility-first styling. 
It aims to streamline the setup process for new Rails projects, allowing you to focus on building features rather than configuring tools.

## Vite

First, we start by creating a new Rails application and opting for Tailwind as our CSS framework:

```bash
rails new rails_vite_tailwind_stimulus
cd rails_vite_tailwind_stimulus
```

Here, we're creating a new Rails application named _rails_vite_tailwind_stimulus_ with the default Rails database SQLite. If you need a different database configuration, feel free to choose one that suits your needs.

Open new repository using text editor of your preference.

Next, we'll briefly follow the Vite Ruby guide by adding the vite_rails gem to our Gemfile and installing it. Run the following command:

```bash
bundle add vite_rails
```

This will install the vite_rails gem, which will allow us to run another command so Vite can handle all the stuff we need under the hood.

Now, run:

```bash
bundle exec vite install
```

This command will:

- Add the `bin/vite` file to start the dev server and run commands.
- Install `vite` and `vite-plugin-ruby`.
- Create the `vite.config.ts` and `config/vite.json` files.
- Generate a sample `application.js` entry point in your app.
- Inject tag helpers into the default `application.html.erb` layout.

If you've followed along correctly, you should see in your terminal:

> Vite ⚡️ Ruby successfully installed! 🎉

Meaning everything is going well, up to this point.

Now, let's move on to the fun part: setting up HMR, and auto-reloading.

Neatly there is a Vite plugin for that called `vite-plugin-rails`

Install the plugin by running:

```bash
yarn add vite-plugin-rails
```

Then, update your `vite.config.ts` to look like this:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import ViteRails from "vite-plugin-rails";

export default defineConfig({
  plugins: [ViteRails()],
});
```

Secondly, by default, Rails uses importmaps, which can conflict with Vite bundling. To avoid this, simply remove the following line from `application.html.erb`:

```erb
<%# application.html.erb %>
<%= javascript_importmap_tags %>
```

Thirdly, you might notice some console errors indicating that Vite isn't connecting to the correct server. To fix this, configure `vite.config.ts` to match your localhost development setup.

Your `vite.config.ts` should now look like this:

```typescript
//vite.config.ts
import { defineConfig } from "vite";
import ViteRails from "vite-plugin-rails";

export default defineConfig({
  plugins: [ViteRails()],
  server: {
    hmr: {
      host: "localhost",
      port: 3036,
    },
  },
});
```

Just before we starting the server, let's create our root page to test our Tailwind and Stimulus setup.

Generate a controller:

```bash
rails generate controller StaticPages homepage
```

Update `config/routes.rb` by adding:

```ruby
# routes.rb
root "static_pages#homepage"
```

---

## Tailwind

Let's add Tailwind CSS to our project. Start by installing Tailwind and its dependencies, then generate the necessary configuration files:

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Next, update the `tailwind.config.js` file to include the paths to all your template files:

```javascript
//tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/views/**/*.rb",
    "./app/views/**/*.html.erb",
    "./app/views/layouts/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Now, add Tailwind's layers to your Vite application by creating an `application.css` file:

```bash
touch app/javascript/entrypoints/application.css
```

Then, add the following Tailwind directives:

```css
/* application.css */
@tailwind base;
@tailwind components;
@tailwind utilities;    
```

To ensure that stylesheets are bundled by Vite, update your `application.html.erb`:

```erb
<%# application.html.erb %>
<%= vite_stylesheet_tag 'application', data: { "turbo-track": "reload" } %>
```

Next, create a `bin/dev` file to streamline the process of running both Rails and Vite servers:

```bash
touch bin/dev
chmod +x bin/dev
```

Add the following script to `/bin/dev`:

```sh
#!/usr/bin/env sh

if ! gem list foreman -i --silent; then
  echo "Installing foreman..."
  gem install foreman
fi

# Default to port 3000 if not specified
export PORT="${PORT:-3000}"

# Let the debug gem allow remote connections,
# but avoid loading until `debugger` is called
export RUBY_DEBUG_OPEN="true"
export RUBY_DEBUG_LAZY="true"

exec foreman start -f Procfile.dev "$@"

```

Finally, ensure your `Procfile.dev` starts both servers:

```bash
# Procfile.dev
vite: bin/vite dev
web: bin/rails s -p 3000

```

Now, run `./bin/dev`. You can start adding Tailwind classes directly to your views, like in `homepage.html.erb`:

```erb
<%# homepage.html.erb %>
<div>
  <h1 class="font-bold text-4xl text-indigo-500">StaticPages#homepage</h1>
  <p>Find me in app/views/static_pages/homepage.html.erb</p>
</div>
```

You should see the following:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/74curwmcv0x9aa8070ld.png)

This confirms that Tailwind CSS is working. You can now test hot reloading by editing CSS classes directly in your views.

---

## Stimulus

Finally, let's add Stimulus to our setup.

First, install `stimulus-vite-helpers` by running:

```bash
# Adding stimulus and stimulus-vite-helpers
yarn add @hotwired/stimulus stimulus-vite-helpers
```

Then, update `app/javascript/entrypoints/application.js` as follows:

```javascript
//application.js
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
```

To test Stimulus, update homepage.html.erb by adding data-controller="hello" to the HTML:

```erb
<%# homepage.html.erb %>
<div>
  <h1 data-controller="hello" class="font-bold text-4xl text-indigo-500">StaticPages#homepage</h1>
  <p>Find me in app/views/static_pages/homepage.html.erb</p>
</div>
```

By default, Rails 7 includes a `hello_controller.js` that will change "StaticPages#homepage" to "Hello, World!", confirming that everything is working correctly.

---

## Wrap Up

That's it! You've set up a Rails app with Vite, Tailwind, and Stimulus, complete with auto-reloading for a smooth development experience. You’ve avoided common setup issues, so now you can focus on building your MVP. Go turn your idea into reality—this setup might just help you achieve the ultimate developer's dream of becoming a farmer! 🎉

Github repository for the boilerplate:

https://github.com/EdvardasBaravykas/rails_vite_tailwind_stimulus
