# xHIS Widget Tutorial

## What is xHIS Widget

An xHIS Widget is a user-facing module which displays information and provides a specific way for users to interact with xHIS. We use widgets to modularize the main functional elements of xHIS. For example, the Login Widget is in charge of the login process, and the Drug Widget helps doctors prescribe drugs.

## xUI

xUI is the core UI component framework designed to implement xHIS widgets. It builds on top of Vue 3. Most of the xUI functionality is developed and maintained by AICS. Use xUI components to implement widgets as possible as you can. No need to reinvent the wheel. A widget developer should use xUI color and typography system for UI consistency and easier maintenance.

## The goal of the tutorial

The goal of the tutorial is to make a frontend developer familiar with xUI & widget development framework, and be able to implement an xHIS user-facing module with consistent visual design, customizability, and rule checking capability.

## The structure of the tutorial

- [Prerequisite](./prerequisite.md)
- [Environment setup](./tutorial-1.md)
  - A developer can download the package, set it up locally, and be able to run the first hello world widget
  - All our code should be compiled into binary. We don’t release our source code. Be very careful about this
- [Basic Vue programming + xUI components](./tutorial-2.md)
  - A developer can start writing his / her widget with basic Vue programming + xUI components
- [Advanced Vue programming + xUI components](./tutorial-3.md)
  - A developer can start using advanced Vue programing + advanced xUI components
  - The skills used here will carry on to the next tutorials
- [Widget & Layout](./tutorial-4.md)
  - A developer follows the guideline to create a widget with widget SDK
  - Use a Static Layout to render page for local development
  - Build widgets and publish to widget service
  - Edit layout on Layout Editor (online) and see the layout changes on tutorial
- [Rule Engine](./tutorial-5.md)
  - A developer modifies her widgets to call Rule Engine
  - A developer adds post-processing code into her widget to show error messages
  - A developer adds new custom action config to Rule Editor to add new action and implement a custom action handler in widget to handle returned action
- [Form Builder](./tutorial-6-zh-tw.md)
  - A developer learns how to use Form Builder to construct her own form
  - A developer learns how to show the form her built and get user input data within form
  - A developer learns how to use Rule Engine to setup rules that trigger a custom form
