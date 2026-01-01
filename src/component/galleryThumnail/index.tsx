import { useState } from "react"
import { LazyDiv } from "../lazyDiv"
import "./index.scss"
import { GALLERY_THUMBS, GALLERY_FULL } from "../../images"

export const GalleryThum = () => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  return (
    <>
      <LazyDiv className="card gallery">
        <h2 className="english">Gallery</h2>

        <div className="gallery-grid">
          {GALLERY_THUMBS.map((thumb, idx) => (
            <div
              key={idx}
              className="gallery-item"
              onClick={() => setViewerIndex(idx)}
            >
              <img
                src={thumb}
                alt={`thumb-${idx}`}
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </LazyDiv>

      {/* 확대 뷰어 (전역 모달 아님) */}
      {viewerIndex !== null && (
        <div className="photo-viewer-overlay" onClick={() => setViewerIndex(null)}>
          <img
            src={GALLERY_FULL[viewerIndex]}
            className="photo-viewer-image"
            onClick={(e) => e.stopPropagation()}
            decoding="async"
          />
          <button
            className="photo-viewer-close"
            onClick={() => setViewerIndex(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
