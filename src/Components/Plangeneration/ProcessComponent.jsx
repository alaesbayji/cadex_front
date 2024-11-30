import React from "react";

const ProcessComponent = ({ onGeneratePlan, generatedFile, onDownloadPlan }) => {
  return (
    <div>
      {generatedFile ? (
        <div>
          <p>File name: {generatedFile}</p>
          <button onClick={onDownloadPlan} className="btn download-button">
            Download Plan
          </button>
        </div>
      ) : (
        <button onClick={onGeneratePlan} className="btn generate-button">
          Generate Plan
        </button>
      )}
    </div>
  );
};

export default ProcessComponent;
