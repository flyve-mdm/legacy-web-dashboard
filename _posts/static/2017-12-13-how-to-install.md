---
layout: post
howtos: true
published: true
title: How to Install
permalink: howtos/installation
description: Step by step
category: user
---

# First of all

You require to have installed GLPI since you'll need the GLPI API. To download it follow this link [GLPI](http://glpi-project.org/spip.php?article41&lang=en). To install it please refer to the respective documentation.

## Get Flyve MDM Web Dashboard

You can download it with any of these methods:

* [Download the latest release from GitHub](https://github.com/flyve-mdm/flyve-mdm-web-dashboard/releases)
* Clone the repo:

```console
    git clone https://github.com/flyve-mdm/flyve-mdm-web-dashboard.git
```

## Dependencies

* Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Install the compass gem:

```console
    gem install compass
```

* Install [Node](https://nodejs.org/en/download/)
* Install the packages grunt-cli and bower globally

```console
    npm install -g grunt-cli
    npm install -g bower
```

* Install development dependencies and bower components

```console
    npm start
```

* Rename the config.example.js to config.js in the app folder

Once this is done, open the file and add the url of the GLPi API and the API Key in the config file. This is the glpi/flyve api_key which is used to save glpi/flyve users

![GLPI ](https://raw.githubusercontent.com/Naylin15/Screenshots/master/dashboard-legacy/api-legacy-dashboard.png)

* Run grunt for building and grunt serve for preview

```console
    grunt && grunt serve
```

It will immediately open the Flyve MDM Web Dashboard on your browser.

### To consider

Some dependencies are deprecated and they will appear to you when you install them, but you can still follow this procedure to install the Flyve MDM Web Dashboard.