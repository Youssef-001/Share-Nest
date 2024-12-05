let folder =  {
    id: "a474d91f-03ae-4f16-802c-121866cf8808",
    name: "New Folder",
    ownerId: 1,
    parentId: null,
    path: "/a474d91f-03ae-4f16-802c-121866cf8808",
    children: [
      {
        id: "ae4ca704-d26d-48bf-a99d-bb14fb77fc0e",
        name: "folder 1.1",
        ownerId: 1,
        parentId: "a474d91f-03ae-4f16-802c-121866cf8808",
        path: "/a474d91f-03ae-4f16-802c-121866cf8808",
        children: [
          {
            id: "f9399fe4-4452-4829-932a-7e2b9571a87b",
            name: "folder 1.1.1",
            ownerId: 1,
            parentId: "ae4ca704-d26d-48bf-a99d-bb14fb77fc0e",
            path: "/a474d91f-03ae-4f16-802c-121866cf8808/ae4ca704-d26d-48bf-a99d-bb14fb77fc0e",
            children: [
            ],
          },
        ],
      },
    ],
  }


function recursive(folder)
{   
    for (let i = 0; i < folder.children.length; i++)
    {
        if (folder.children[i].length == 0)
            return;
        
            else 
            {
                console.log(`${folder.children[i].path}/${folder.children[i].id}`) // place html here
                recursive(folder.children[i]);
            }

    }
}

recursive(folder)