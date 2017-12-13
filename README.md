# Flyve MDM Dashboard

<img style="width:100%;" src="https://user-images.githubusercontent.com/663460/26935464-54267e9c-4c6c-11e7-86df-8cfa6658133e.png">

[![License](https://img.shields.io/github/license/flyve-mdm/legacy-web-dashboard.svg?&label=License)](https://github.com/flyve-mdm/legacy-web-dashboard/blob/develop/LICENSE.md)
[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)
[![Follow twitter](https://img.shields.io/twitter/follow/FlyveMDM.svg?style=social&label=Twitter&style=flat-square)](https://twitter.com/FlyveMDM)
[![Telegram Group](https://img.shields.io/badge/Telegram-Group-blue.svg)](https://t.me/flyvemdm)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Greenkeeper badge](https://badges.greenkeeper.io/flyve-mdm/legacy-web-dashboard.svg)](https://greenkeeper.io/)

Flyve MDM is a mobile device management software that enables you to secure and manage all the mobile devices of your business via a unique web-based console (MDM).

To get started, check out the [website](https://flyve-mdm.com/)!

## Table of contents

* [Overview](#overview)
* [Build Status](#build-status)
* [Installation](#installation)
* [Documentation](#documentation)
* [Versioning](#versioning)
* [Contact](#contact)
* [Contribute](#contribute)
* [Copyright and license](#copying)

## Overview

Our solution allows you to efficiently and easily control any aspects of your Android-based mobile fleet, providing a panel of functionalities:

* Provided as a SaaS platform
* Google independent
* Deploy and configure applications
* Deploy files
* Wipe a phone
* Work with devices running Android 4.4 or higher
* Simple web application user interface

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

## Build Status

|**Release channel**|Beta Channel|
|:---:|:---:|
|[![Build Status](https://travis-ci.org/flyve-mdm/legacy-web-dashboard.svg?branch=master)](https://travis-ci.org/flyve-mdm/legacy-web-dashboard)|[![Build Status](https://travis-ci.org/flyve-mdm/legacy-web-dashboard.svg?branch=develop)](https://travis-ci.org/flyve-mdm/legacy-web-dashboard)|

## Installation

Several quick start options are available:

* [Download the latest release](https://github.com/flyve-mdm/legacy-web-dashboard/releases/latest).
* Clone the repo: `git clone https://github.com/flyve-mdm/legacy-web-dashboard.git`.
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

## Documentation

We maintain a detailed documentation of the project on the [website](http://flyve.org/legacy-web-dashboard/).

## Versioning

In order to provide transparency on our release cycle and to maintain backward compatibility, Flyve MDM is maintained under [the Semantic Versioning guidelines](http://semver.org/). We are committed to following and complying with the rules, the best we can.

See [the tags section of our GitHub project](http://github.com/flyve-mdm/legacy-web-dashboard/tags) for changelogs for each release version of Flyve MDM. Release announcement posts on [the official Teclib' blog](http://www.teclib-edition.com/en/communities/blog-posts/) contain summaries of the most noteworthy changes made in each release.

## Contact

For notices about major changes and general discussion of Flyve MDM development, subscribe to the [/r/FlyveMDM](http://www.reddit.com/r/FlyveMDM) subreddit.
You can also chat with the project maintainers and community members via IRC in [#flyve-mdm on freenode](http://webchat.freenode.net/?channels=flyve-mdm) or [@flyvemdmdev on Telegram](https://t.me/flyvemdmdev).

### Creators

### Nelson Zamith

* <https://github.com/Newls>

### Alexander J Salas B

* <https://github.com/ajsb85>

And don't forget to ...

* Like [Flyve MDM on Facebook](https://www.facebook.com/Flyve-MDM-1625450937768377/).
* Implementation help may be found at Stack Overflow (tagged [`flyve-mdm`](https://stackoverflow.com/questions/tagged/flyve-mdm)).
* Visit [Flyve MDM on Wikipedia](https://fr.wikipedia.org/wiki/Flyve_MDM).

## Contribute

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](https://github.com/flyve-mdm/legacy-web-dashboard/blob/develop/.github/CONTRIBUTING.md) and then check out one of our issues in the [Issues Dashboard](https://github.com/flyve-mdm/legacy-web-dashboard/issues).

## Copying

* **Name**: [Flyve MDM](https://flyve-mdm.com/) is a registered trademark of [Teclib'](http://www.teclib-edition.com/en/).
* **Code**: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License ([AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html)).
* **Documentation**: released under Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)).
* **Copyright (C) 2015-2017 Teclib'**
