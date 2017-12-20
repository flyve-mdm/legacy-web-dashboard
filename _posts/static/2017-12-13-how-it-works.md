---
layout: post
howtos: true
published: true
title: How it works
permalink: howtos/how-it-works
description: What you need to know
---

Flyve MDM Web Dashboard allows you to efficiently manage your Android-based mobile fleet, provided as a SaaS platform combined with an intuitive and simple user interface our solution lets you take control of your fleets from any web browser.

This web application is part of the Flyve MDM distribution, which includes:

* The Flyve MDM GLPI Plugin
* The Flyve MDM web console

Designed to work with GLPI, it requires the GLPI API Rest with which to save glpi/flyve users.

### Its structure

These aspects provide a small description of the project.

#### Services

* auth.js: handles the authentification with the GLPi API within the entire app
* includes an $http interceptor to provide GLPi API's `session_token`

#### Controller/View pairs

* devices.js / devices.html: the most important `Flyve MDM` screen, showing current devices
* fleets.js / admin_fleets.html: the screen which helps managing `Flyve MDM` fleets
* ... (they are likely to change)

#### Sass/CSS

* an app.sass module includes every other sass modules
* which contains the visual css code for the entire frontend app
* that app.sass builds to app.css