#!/usr/bin/env node

var http = require('http');
var path = require('path');
var fs = require('fs');

var argv = process.argv.slice(2);
var types = {
  'appcache': 'text/cache-manifest',
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/vnd.microsoft.icon',
  'jpeg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'png': 'image/png'
};

http.createServer(function(req, res){
	console.log(new Date().toISOString() + ' ' + req.method + ' ' + req.url);
	
	var filePath = '.' + req.url;
	if (filePath == './') filePath += 'index.html';

	var noappcache = argv.indexOf('-noappcache') > -1; // Prevent page from being app-cached
	var simslow = argv.indexOf('-simslow') > -1; // Simulate "slow" connection
	fs.exists(filePath, function(exists){
		if (exists){
			if (noappcache && /\.appcache$/.test(filePath)){
				res.writeHead(404);
				res.end();
			}
			fs.stat(filePath, function(err, stats){
				var isDir = false;
				if (err){
					response.writeHead(500);
					res.end();
				} else if (stats.isFile() || (isDir = stats.isDirectory())){
					if (isDir) filePath = filePath.replace(/(.)\/?$/i, '$1/index.html');
					fs.readFile(filePath, function(e, content){
						if (e){
							response.writeHead(500);
							res.end();
						} else {
							var ext = path.extname(filePath).slice(1);
							if (simslow){
								res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream'});
								setTimeout(function(){
									res.end(content, 'utf-8');
								}, Math.round(Math.random()) ? 1000 : 500);
							} else {
								res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream'});
								res.end(content, 'utf-8');
							}
						}
					});
				} else {
					res.writeHead(404);
					res.end();
				}
			});
		} else {
			res.writeHead(404);
			res.end();
		}
	});
}).listen(80);