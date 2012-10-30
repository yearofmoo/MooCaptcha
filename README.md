# MooCaptcha

MooCaptcha is a MooTools JavaScript wrapper to make using the ReCaptcha library very easy in a web application.

## Usage

Here is an example of how to use it:

```javascript
new MooCaptcha(container,{
  publicKey:'...', //paste your public key here
  theme:'some theme listed on the Recaptcha Documentation',
  onLoading : function() { ... }, //fires when the script is loading the recaptcha object from Google
  onReady : function() { ... }, //this fires when the recaptcha object is ready
  onLibraryError : function() { ... } //this fires when the library isn't found or fails to load
});
```


## More Info + Documentation

The full documentation for this plugin can be found at:

http://www.yearofmoo.com/code/MooCaptcha.html
