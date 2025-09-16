import React, { useState } from "react";
import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
} from "react-pdf-highlighter";
import { v4 as uuidv4 } from "uuid";
import API from "../api/axios";

const mapBackendToFrontend = (h) => ({
  id: uuidv4(),
  content: { text: h.text },
  position: {
    boundingRect: {
      x1: h.coordinates.left,
      y1: h.coordinates.top,
      x2: h.coordinates.left + h.coordinates.width,
      y2: h.coordinates.top + h.coordinates.height,
      width: h.coordinates.width,
      height: h.coordinates.height,
    },
    rects: [
      {
        x1: h.coordinates.left,
        y1: h.coordinates.top,
        x2: h.coordinates.left + h.coordinates.width,
        y2: h.coordinates.top + h.coordinates.height,
        width: h.coordinates.width,
        height: h.coordinates.height,
      },
    ],
    pageNumber: h.pageNumber,
  },
});

const mapFrontendToBackend = ({ position, content }) => ({
  text: content.text,
  pageNumber: position.pageNumber,
  coordinates: {
    left: position.boundingRect.x1,
    top: position.boundingRect.y1,
    width: position.boundingRect.width,
    height: position.boundingRect.height,
  },
});

const PdfComp = ({ file, setFile }) => {
  const [pendingSelection, setPendingSelection] = useState(null);

  const saveHighlight = async ({ position, content }) => {
    if (!content.text.trim()) return;

    const frontendHighlight = {
      id: uuidv4(),
      content,
      position,
    };

    try {
      await API.post(
        `/files/${file._id || file.id}/highlights`,
        mapFrontendToBackend(frontendHighlight)
      );
      setFile((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), frontendHighlight],
      }));
    } catch (err) {
      console.error("Error saving highlight", err);
    }
  };

  return (
    <div className="w-full h-[70vh] border overflow-hidden relative">
      <PdfLoader url={file.previewUrl} beforeLoad={<div>Loading PDF…</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => event.altKey}
            onSelectionFinished={(position, content, hideTip) => {
              if (content?.text?.trim()) {
                setPendingSelection({ position, content });
              }
              hideTip(); 
            }}
            highlightTransform={(highlight, index) => (
              <Popup
                key={highlight.id || index}
                popupContent={<div>{highlight.content?.text}</div>}
              >
                <Highlight
                  isScrolledTo={false}
                  position={highlight.position}
                  comment={{ text: highlight.content?.text }}
                />
              </Popup>
            )}
            highlights={(file.highlights || []).map(mapBackendToFrontend)}
          />
        )}
      </PdfLoader>

      {/* Confirmation buttons for selection */}
      {pendingSelection && (
        <div className="absolute bottom-2 left-2 bg-white border rounded shadow p-2 flex gap-2">
          <span className="text-sm text-gray-700">
            "{pendingSelection.content.text.slice(0, 30)}..."
          </span>
          <button
            onClick={() => {
              saveHighlight(pendingSelection);
              setPendingSelection(null);
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Highlight
          </button>
          <button
            onClick={() => setPendingSelection(null)}
            className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfComp;
