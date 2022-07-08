import * as React from "react";
import { useState } from "react";
import  {Storage}  from "@aws-amplify/storage";
import { Button,TopNavigation,ColumnLayout,Container,Icon,TextContent } from "@awsui/components-react";

function GuestMode()
{
    const [files,setFiles] = useState();
    const [listItems,setListItems] = useState([]);
    const [endOfFiles,setEndOfFiles] = useState(false);
    function fetchFirstPage(){
        fetchPage();
    }

    async function fetchPage(){
            let response = await Storage.list('',{maxKeys : 500});
            console.log(response);
            setListItems(response);
            let listItemFiles = await Promise.all(response.map(async k => {
            const signedURL = await Storage.get(k.key);
            return signedURL;
          }));
          setFiles(listItemFiles);
      }

      async function callNextPage()
      {
        if(listItems.hasNextPage) {
          const data = await listItems.nextPage();
          setListItems(data);
          let listItemfiles =  data;
          console.log(data);
          let imageContent = listItemfiles;
          let nextImages = await Promise.all(imageContent.map(async k => {
          const signedURL = await Storage.get(k.key);
          return signedURL;
         }));
        setFiles(nextImages);
        if(!listItemfiles.hasNextPage)
        { setEndOfFiles(true); }
      }
    }
      return(  
      <div>
        <TopNavigation
      identity={{
        href: "/",
        title: "Welcome to Guest Mode", 
      }}
      utilities={[
        {
        href: "/",
        title: "Welcome to Guest Mode", 
        },
        // {
        //   type: "button",
        //   text: "Admin Mode",
        //   iconName: "user-profile",
        //   href:"signIn",
        // }
      ]}
      i18nStrings={{
        searchIconAriaLabel: "Search",
        searchDismissIconAriaLabel: "Close search",
        overflowMenuTriggerText: "More",
        overflowMenuTitleText: "All",
        overflowMenuBackIconAriaLabel: "Back",
        overflowMenuDismissIconAriaLabel: "Close menu"
      }}
    />
        <TextContent>&nbsp;<strong><h1>&nbsp;&nbsp;&nbsp;&nbsp;To list all the files in the storage click on <Button variant="primary" onClick={fetchFirstPage}>View Files</Button></h1></strong></TextContent>
        &nbsp;
        <ColumnLayout columns={6}>
          {files && files.map(image => (
            <div key = {image} >
              <Container style={{alignContent:"center"}}>
              <img  style ={{ height : 180, width:180 ,}} src = {image} alt = "from storage"/>
              <br></br>
              </Container>
            </div>
          ))}
          </ColumnLayout>
       <p></p>
            {files && !endOfFiles &&
          <p style = {{textAlign: "center"}}><Button variant="primary" onClick = {callNextPage} >Next <Icon name="angle-right" /></Button></p>}
          {endOfFiles && <p style = {{textAlign: "center"}}>You donot have any file left</p>}
      </div>);
}

export default GuestMode;
