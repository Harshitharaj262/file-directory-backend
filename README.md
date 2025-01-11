# File Directory Backend Project


## Pre-requisites
 Install Node.js version 22.12.0

## To Run Locally

Clone down this repository. You will need `node` and `npm` installed globally on yor machine

Installation: 
### `npm install`

To Start Server
### `npm start`

To visit app

### `localhost:3001`

## Create .env file
Add the following variables to your .env

PORT=3001

MONGODB_URL=`your-mongdb-url`


### API Documentation

`GET: /api`

```
Response: {
  "name":"name",
  "type":"file / folder",
  "parentId": "null (root) || parent objectID",
  "children":[ {
     "name":"name",
     "type":"file / folder",
     "parentId": "null (root) || parent objectID",
     "children":[ {
    
     }],
     "createdAt":"Date created",
     "updatedAt":"Date updated"
}],
   "createdAt":"Date created",
"updatedAt":"Date updated"
}
```

`POST: /api/create`

```
Request body: {
    "name":"name",
    "type":"file / folder",
    parentId":"null (root) || parent objectID",
}
```

```
Response: {
     "name":"name",
     "type":"file / folder",
      "parentId": "null (root) || parent objectID",
      "children":[],
      "createdAt":"Date created",
      "updatedAt":"Date updated"
}
```

`PUT : /api/updated/:id`
```
Request body: {
    "name":"name",
    "type":"file / folder",
    parentId":"null (root) || parent objectID",
}
```

```
Response: {
    message: "Successfuly updated file / folder"
}
```


`PUT : /api/move`
```
Request body: {
    "sourceId":"objectId",
    "destinationId":"objectId",
}
```

```
Response: {
    message: "Successfuly moved file / folder"
}
```





`DELETE : /api/delete`
```
Request body: {
    "ids":["objectID"]
}
```

```
Response: {
    message: "Successfuly deleted file / folder"
}
```



