# the-platform-client

Client for the TABLEFLIP static site generator

## Client-side structure

We use *kadira:flow-router* along with the npm module *react-mounter* to render pages.

**client/routes.jsx** - contains routing, imports pages from:

**client/pages** - a directory of page components, as well as layout components which may be used to render them inside.

**client/components** - reusable components which can be imported where required into pages.
