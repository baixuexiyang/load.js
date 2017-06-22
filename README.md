# load.js
load javascript and styles with sync or async, if the file is in the same domain, it is loaded in Ajax mode.

# Methods
## load.sync
load files with sync
```
load.sync("index.js", function() {
	callback
});
```

## load.async
load files with async
```
load.async("index.js", function() {
	callback
});
```

## load.register
register a module, you can use this module to load file
```
load.register("file",url);
load.sync("test", function() {
	callback	
});
```

you can also 
```
load.sync(["file1", "file2"], function() {
	callback	
});
```
