Getting Started With JQuery Snake plugin
========================================

This JQuery Snake plugin provides a Snake game usable as provided, or a base 
to build your own custom game snake. 

## Prerequisites

In order to use this plugin, you have to use [JQuery](http://jquery.com/) with your website. 

## Installation

1. Download the plugin
2. Write your HTML container
3. Init the snake

### Step 1: Download JQuery Snake plugin

You can download an archive from this repository or use [npm]() to download the package. 

To install it using npm, use the following command: 

``` javascript
npm install b0ulzy-snake

```

### Step 2: Write your HTML container

All you need is a HTML block element as container (a <div> element is the perfect match) to contain the Snake canvas. 

### Step 3: Init the snake

To init the snake, use the following script: 

``` javascript 
$('#container').snake({startOnLoad:true});
``

## Customize the plugin

Now that you have a functionnal snake on your website, you may want custom it a bit. 
In order to achieve that, please see the following documentation: [Overriding default settings](overriding_settings.md).
