# the-platform-client

Client for the TABLEFLIP static site generator

## Getting started

- Copy `settings.json.tpl` to `settings.json`
- Grab the `clientId` & `clientSecret` from: https://github.com/organizations/tableflip/settings/applications/313932

Now start it up with a

```sh
meteor --settings setting.json
```

## Client-side structure

We use *kadira:flow-router* along with the npm module *react-mounter* to render pages.

**client/routes.jsx** - contains routing, imports pages from:

**client/pages** - a directory of page components, as well as layout components which may be used to render them inside.

**client/components** - reusable components which can be imported where required into pages.

## Collections

### Projects

A record of user projects which exist on Github.

```json
{
  "_id": "08joikjf2o43ijf2oij23fo",
  "name": "my-awesome-site",
  "full_name": "tableflip/my-awesome-site",
  "lastCommmit": {
    "sha": "9834hf938j4f03fj3049fj340j",
    "dateTime": "2016-03-03T11:55:42.943Z"
  },
  "facts": {
    "sha": "094uf094jf3094jf049fj0249jf",
    "json": {
      "brandPrimary": "#dd4488",
      "foo": "bar"
    }
  },
  "users": [
    "ij03jf0293j59j02f",
    "8j02f038h30t938hd"
  ]
}
```

### Pages

Pages which exist within an individual project.

```json
{
  "_id": "dof0f3j3j9j3jfp2onc3kr3a",
  "name": "about",
  "project": {
    "full_name": "tableflip/my-awesome-site",
    "_id": "08joikjf2o43ijf2oij23fo"
  },
  "lastCommmit": {
    "sha": "9834hf938j4f03fj3049fj340j"
  },
  "content": {
    "sha": "094uf094jf3094jf049fj0249jf",
    "json": {
      "pageSpecific": "variable",
      "heading": "This is very interesting"
    }
  }
}
```

## Publications

`Subs.subscribe('projects')` - Returns all the project docs to which the logged-in user has access.

`Subs.subscribe('project', PROJECT_ID)` - Returns the given project and all its pages, provided the logged in user has access to it.

## Methods

`Meteor.call('projects/updateFact', { projectId: '08joikjf2o43ijf2oij23fo', key: 'foo', newValue: 'baz' }, cb)`

`Meteor.call('pages/updateContent', { pageId: 'dof0f3j3j9j3jfp2onc3kr3a', key: 'heading', newValue: 'Hello World' }, cb)`

`Meteor.call('projects/sync', cb)` - syncs all of the logged in user's projects.  **This is run automatically on login**.
