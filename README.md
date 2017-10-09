<img style="width:100%;" src="https://user-images.githubusercontent.com/663460/26935464-54267e9c-4c6c-11e7-86df-8cfa6658133e.png">

# [Flyve MDM](https://flyve-mdm.com)

[![Greenkeeper badge](https://badges.greenkeeper.io/flyve-mdm/flyve-mdm-web-dashboard.svg)](https://greenkeeper.io/)

<!-- markdownlint-disable MD013 -->
[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)
[![Build Status](https://travis-ci.org/flyve-mdm/flyve-mdm-web-ui.svg?branch=master)](https://travis-ci.org/flyve-mdm/flyve-mdm-web-ui)

Flyve MDM is a mobile device management software that enables you to secure and manage all the mobile devices of your business via a unique web-based console (MDM).

To get started, check out <https://flyve-mdm.com/>!

## Table of contents

* [Quick start](#quick-start)
* [Overview](#overview)
* [Bugs and features requests](#bugs-and-features-requests)
* [Documentation](#documentation)
* [Contributing](#contributing)
* [Community](#community)
* [Versioning](#versioning)
* [Roadmap](#roadmap)
* [Creators](#creators)
* [Copyright and license](#copyright-and-license)

## Overview

Our solution allows you to efficiently and easily control any aspects of your Android-based mobile fleet, providing a panel of functionalities:

* Provided as a SaaS platform
* Google independent
* Deploy and configure applications
* Deploy files
* Wipe a phone
* Work with devices running Android 4.4 or higher
* Simple web application user interface

## Quick start

Several quick start options are available:

* [Download the latest release](https://github.com/flyve-mdm/flyve-mdm-web-ui/releases/latest).
* Clone the repo: `git clone https://github.com/flyve-mdm/flyve-mdm-web-ui.git`.
* Install Ruby.
* Install the compass gem:

```sh
gem install compass
```

* Install Node.
* Install the packages `grunt-cli` and `bower` globally.

```sh
npm install -g grunt-cli
npm install -g bower
```

* Install development dependencies and bower components.

```sh
npm start
```

* Rename the `config.sample.js` to `config.js` in the `app` folder.
* Add the url of the GLPi API and add the API Key in the config file. This is the glpi/flyve api_key which is used to save glpi/flyve users.
* Run `grunt` for building and `grunt serve` for preview.

Read the page of [Yeoman generator for AngularJS](https://github.com/yeoman/generator-angular#generators/) for information on the available generators, and more.

## Testing

Running `grunt test` will run the unit tests with karma.

### What's important

Note: this section is not exhaustive nor finished, it is explaining the source code a bit.

This web application is supposed to be packaged within the Flyve MDM distribution,
which includes

* The `Flyve MDM` GLPi Module
* The `Flyve MDM` web console (repository)

We are still working on how we are going to package the whole `Flyve MDM` software distribution.

You can run the  `tree` unix command in your working copy of this repository, but,
the following points are important:

#### Services

* auth.js : handles the authentification with the GLPi API within the entire app
* includes an $http interceptor to provide GLPi API's `session_token`

#### Controller/View pairs

* devices.js / devices.html: the most important `Flyve MDM` screen, showing current devices
* fleets.js / admin_fleets.html: the screen which helps managing `Flyve MDM` fleets
* ... (they are likely to change)

#### Sass/CSS

* a app.sass module includes every other sass modules
* which contains the visual css code for entire the frontend app
* that app.sass builds to app.css

#### Build system

* [generator-angular](https://github.com/yeoman/generator-angular) via [Yeoman](http://yeoman.io/)

## Bugs and features requests

You have a bug or a feature request? Please first read the [issue guidelines](http://github.com/flyve-mdm/flyve-mdm-web-ui/blob/master/CONTRIBUTING.md#using-the-issue-tracker) and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](http://github.com/flyve-mdm/flyve-mdm-web-ui/issues/new).

## Documentation

Flyve MDM's documentation is on the [Wiki of GitHub](https://github.com/flyve-mdm/flyve-mdm-web-ui/wiki).

## Contributing

Please read our [contributing guidelines](http://github.com/flyve-mdm/flyve-mdm-web-ui/blob/master/.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Moreover, if your pull request contains JavaScript patches or features, you must include [relevant unit tests](https://github.com/flyve-mdm/flyve-mdm-web-ui/tree/master/test). All HTML and CSS should conform to the [Code Guide](https://github.com/mdo/code-guide), maintained by [Mark Otto](https://github.com/mdo).

Editor preferences are available in the [editor config](http://github.com/flyve-mdm/flyve-mdm-web-ui/blob/master/.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.

## Community

Get updates on Flyve MDN's development and chat with the project maintainers and community members.

* Follow [@FlyveMDM on Twitter](https://twitter.com/flyvemdm).
* Like [Flyve MDM on Facebook](https://www.facebook.com/Flyve-MDM-1625450937768377/).
* Read and subscribe to [the Teclib' blog](http://www.teclib-edition.com/en/communities/blog-posts/).
* Join [the IRC channel](irc://irc.freenode.org/flyve-mdm).
* Implementation help may be found at Stack Overflow (tagged [`flyve-mdm`](https://stackoverflow.com/questions/tagged/flyve-mdm)).
* [Flyve MDM on Wikipedia](https://fr.wikipedia.org/wiki/Flyve_MDM).

## Versioning

In order to provide transparency on our release cycle and to maintain backward compatibility, Flyve MDM is maintained under [the Semantic Versioning guidelines](http://semver.org/). We are committed to following and complying with the rules, the best we can.

See [the tags section of our GitHub project](http://github.com/flyve-mdm/flyve-mdm-web-ui/tags) for changelogs for each release version of Flyve MDM. Release announcement posts on [the official Teclib' blog](http://www.teclib-edition.com/en/communities/blog-posts/) contain summaries of the most noteworthy changes made in each release.

## Roadmap

We are eager to build together the best software in the IT industry, for mobile device management. In order to help you prioritize what to focus on and to share insights on our priorities, we have published Flyve MDM’s Platform Roadmap. This roadmap is a rough estimate of what we are planning on building in the near-, medium-, and long-term.

Placement on the roadmap represents our estimate of when each project will enter full production release. Some larger features will land in your hands through Early Access programs in advance of their full release.

The items in the roadmap are subject to change or delay, so you should not use this for major planning purposes. We will do our best to keep the roadmap updated, and we will review the roadmap monthly to ensure it reflects our most up-to-date features inventory.

Source codes will be released during fall 2016.

You can follow the progress on the opened and closed issues, opened and closed merge requests, percentage of completion and remaining days, in the following links of every milestone.

### Disclaimer

This roadmap is for informational purposes only, so you shouldn't rely on this information for major purchasing or planning purposes. Just like all projects, the items in the roadmap are subject to change or delay, and the continued development or release of a project on the roadmap is at the sole discretion of Teclib'.

## Creators

### Nelson Zamith

* <https://github.com/Newls>

### Alexander J Salas B

* <https://github.com/ajsb85>

## Copyright and license

Code and documentation copyright 2015-2016 Teclib'. Code released under [the AGPL v3 license](http://github.com/flyve-mdm/flyve-mdm-web-ui/blob/master/LICENSE.md). Docs released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
