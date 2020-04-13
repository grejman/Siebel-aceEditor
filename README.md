# Siebel-ace Editor

Siebel Open-UI implementation of the ace Editor Control using Phisical Wraper.

The Editor is used to display XML and JSON data formatted for eazy vewing.  The ace Editor can be found at:

* https://github.com/ajaxorg/ace-builds

# Siebel Vertion

  IP2015
  IP2016
  IP2017/18/19/20

# Implementation

To implement the Physical Wraper the following will need to be done:

* Load the Physical Wraper "gmaceEditorPW.js" to the "..\PUBLIC\scripts\Siebel\custom" folder.
* On your Applet create a control  with the name "gmaceEditor".
* Add the Physical Wraper to the Application under Manifest Administration.
* Add the Style Sheet to the Application under Manifest Administration.

Note: The control will need network access to https://cdnjs.cloudflare.com/

# Contributions

Contributions are welcome.
