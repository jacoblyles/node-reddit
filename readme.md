# Node Reddit

To use:

```bash
$ node app.js
```

To use with login, do one of the following: 
```bash
$ node app.js -u username -p password
$ node app.js --user username --paswd password
$ node app.js username password
```

Reddit rate limits logins, so this will only work a few times in a ten minute interval, after which reddit will return the un-logged in front page. The next feature will be to cache cookies on disk so we don't have to login with every run. 

Have fun!

[Kamranicus](http://kamranicus.com)
[jacoblyles](http://jacoblyles.com)