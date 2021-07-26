// import CKEditor from "./ckeditor";
// import React, { useState, useEffect } from "react";

// export const Editor = (props) => {
//   const { handleContentChange, content } = props;
//   // constructor(props) {
//   //     super(props);
//   //     this.updateContent = this.updateContent.bind(this);
//   //     this.state = {
//   //         content: 'content',
//   //     }
//   // }

//   const updateContent = (newContent) => {
//     handleContentChange(newContent);
//     // this.setState({
//     //     content: newContent
//     // })
//   };

//   const onChange = (evt) => {
//     var newContent = evt.editor.getData();
//     handleContentChange(newContent);
//     // this.setState({
//     //   content: newContent
//     // })
//   };

//   const onBlur = (evt) => {
//     console.log("onBlur event called with event info: ", evt);
//   };

//   const afterPaste = (evt) => {
//     console.log("afterPaste event called with event info: ", evt);
//   };

//   return (
//     <CKEditor
//       activeClass="p10"
//       content={content}
//       events={{
//         blur: onBlur,
//         afterPaste: afterPaste,
//         change: onChange,
//       }}
//     />
//   );
// };

//testing
import React, { Component, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export const Editor = (props) => {
  const { handleContentChange, content } = props;
//   const [localContent, setLocalContent] = React.useState(``);
//   const [editor,setEditor] = React.useState(null);
//   <h2>sample</h2><p>&nbsp;has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap int</p><figure class="media"><oembed url="https://www.youtube.com/watch?v=U-dDjYoFkUM"></oembed></figure>
//   `);

//   useEffect(() => {
//       if(editor != null){
//         editor.setData(content);
//       }
    
//   }, [content]);

  const setContentNow = (editor) =>{
    editor.setData(content);
  }

  return (
    <div className="App">
      <h5>Write Blog content</h5>
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          // console.log( 'Editor is ready to use!', editor );
          setContentNow(editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          handleContentChange(data);
        }}
        onBlur={(event, editor) => {
          // console.log( 'Blur.', editor );
        }}
        onFocus={(event, editor) => {
          // console.log( 'Focus.', editor );
        }}
      />
    </div>
  );
};
