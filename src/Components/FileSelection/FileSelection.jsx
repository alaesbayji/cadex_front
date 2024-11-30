import React, { useState } from "react";
import shp from "shpjs";
import JSZip from "jszip";
import "./fileselection.scss";

const FileSelection = ({ onFileUpload  }) => {

  return (
    <div className="file-selection-container">
     <h3>Import File</h3>
     <input type="file" onChange={onFileUpload} accept=".zip" />
    </div>
  );
};

export default FileSelection;
