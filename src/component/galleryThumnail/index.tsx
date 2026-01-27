import { useState, useEffect, useRef } from "react" // ✅ (추가) useRef
import { LazyDiv } from "../lazyDiv"
import "./index.scss"
import ArrowLeft from "../../icons/angle-left-sm.svg?react"
import { GALLERY_THUMBS, GALLERY_FULL } from "../../images"

export const GalleryThum = () => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const prevImage = () => {
    if (viewerIndex === null) return
    setViewerIndex((viewerIndex + GALLERY_FULL.length - 1) % GALLERY_FULL.length)
  }

  const nextImage = () => {
    if (viewerIndex === null) return
    setViewerIndex((viewerIndex + 1) % GALLERY_FULL.length)
  }

  //(추가) 스와이프 시작점 저장용 ref (원본 로직 건드리지 않음)
  const startXRef = useRef<number | null>(null)
  const startYRef = useRef<number | null>(null)

  //(추가) 스와이프 감도(원하면 30~60 사이로 조절)
  const SWIPE_THRESHOLD = 40

  //(추가) 포인터 다운: 시작 좌표 저장
  const handlePointerDown = (e: React.PointerEvent) => {
    // 오버레이가 닫힌 상태면 의미 없음
    if (viewerIndex === null) return

    startXRef.current = e.clientX
    startYRef.current = e.clientY
  }

  //(추가) 포인터 업: 이동 거리 계산 후 prev/next 호출
  const handlePointerUp = (e: React.PointerEvent) => {
    if (viewerIndex === null) return
    if (startXRef.current == null || startYRef.current == null) return

    const dx = e.clientX - startXRef.current
    const dy = e.clientY - startYRef.current

    // 다음 스와이프를 위해 초기화
    startXRef.current = null
    startYRef.current = null

    // ✅ 세로 이동이 더 크면 스와이프가 아니라 "스크롤/탭"로 보고 무시 (오작동 방지)
    if (Math.abs(dy) > Math.abs(dx)) return

    // ✅ 오른쪽으로 드래그 = 이전 사진
    if (dx > SWIPE_THRESHOLD) {
      prevImage()
      return
    }

    // ✅ 왼쪽으로 드래그 = 다음 사진
    if (dx < -SWIPE_THRESHOLD) {
      nextImage()
      return
    }
  }

  return (
    <>
      <LazyDiv className="card gallery">
        <h2 className="english">Gallery</h2>
        <div className="break" />
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
        <div
          className="photo-viewer-overlay"
          onClick={() => setViewerIndex(null)}
          // ✅ (추가) 스와이프 이벤트: 오버레이에서 좌우 드래그로 prev/next
          // - 버튼 이동 UX는 그대로 유지
          // - 스크롤바는 생기지 않음(overflow 스크롤을 사용하지 않음)
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <img
            src={GALLERY_FULL[viewerIndex]}
            className="photo-viewer-image"
            onClick={(e) => e.stopPropagation()}
            decoding="async"
            // ✅ (추가) 이미지 위에서도 스와이프가 잘 먹도록(overlay 클릭 닫힘 방지)
            onPointerDown={(e) => {
              e.stopPropagation()
              handlePointerDown(e)
            }}
            onPointerUp={(e) => {
              e.stopPropagation()
              handlePointerUp(e)
            }}
          />

          <div
            className="carousel-control"
            // ✅ (추가) 컨트롤 레이어에서도 스와이프 가능하게(화살표 영역이 넓어서 여기서도 잡히게)
            onPointerDown={(e) => {
              e.stopPropagation()
              handlePointerDown(e)
            }}
            onPointerUp={(e) => {
              e.stopPropagation()
              handlePointerUp(e)
            }}
          >
            <div
              className="control left"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
            >
              <ArrowLeft className="arrow" />
            </div>

            <div
              className="control right"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
            >
              <ArrowLeft className="arrow right" />
            </div>
          </div>

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
