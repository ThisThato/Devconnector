# DevConnector

> Social Media Application for developers

This is a MERN stack application for developers to showcase their work, create a profile and post their opinions.

## Quick Start

---

## Add a default.json file in the config folder with the following

```
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
}
```

## Install server dependencies

```
npm install
```

## Install client dependecies

```
cd client
npm install
```

## Run both Express and React from root

```
npm run dev
```

###Build for production

```
cd client
npm run build
```

# Test product before deploy

After running a build in the client 👆, cd into the root of the project.
And run...

```
NODE_ENV=production node server.js
```

Check in browser on [http://localhost:5000/](http://localhost:5000/)

# Deploy to Heroku

If you followed the sensible advice above and included `config/default.json` and `config/production.json` in your .gitignore file, then pushing to Heroku will omit your config files from the push.
However, Heroku needs these files for a successful build.
So how to get them to Heroku without commiting them to GitHub?

What I suggest you do is create a local only branch, lets call it _production_.

`git add -f config/production.json`

This will track the file in git on this branch only.
**DO NOT THE PRODUCTION BRANCH TO GITHUB**

Commit the following

```
git commit -m 'ready to deploy'
```

Create your Heroku Project

```
heroku create
```

And push the local production branch to the renote heroku master branch.

```
git push heroku production:master
```

Now Heroku will have the config it needsd to build the project.

> Do not forget to make sure your production database is not whitelisted in
> MongoDB Atlas, otherwise the database connection will fail and your app will crash

After deployment you can delete the production branch if you like.

```
git checkout master
git branch -D production
```

Or you can leave it to merge and push updates from another branch.
Make any changes you need on your master branch and merge into your production branch

```
git checkout production
git merge master
```

## Once merged you can push to heroku as above and your site will rebuild and be updated

---

## Preview
![Annotation 2020-06-22 055928 (2)](https://user-images.githubusercontent.com/39223762/87814977-0e932d80-c865-11ea-9dde-d60ed8b3c067.png)
![Posts](https://user-images.githubusercontent.com/39223762/87814985-14890e80-c865-11ea-87c2-668d03444a23.jpg)
![Profile](https://user-images.githubusercontent.com/39223762/87814991-1783ff00-c865-11ea-85bf-e5ed87751cef.jpg)
![People](https://user-images.githubusercontent.com/39223762/87814998-1a7eef80-c865-11ea-83a9-17f334fba119.jpg)


## App Info

## Author
Thato Motaung
