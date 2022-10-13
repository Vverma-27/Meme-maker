import React, { RefObject, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { usePalette } from "color-thief-react";
import {
  BiBody,
  BiBold,
  BiFontColor,
  BiFontSize,
  BiImage,
  BiText,
  BiTrash,
} from "react-icons/bi";
// import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import { Rnd } from "react-rnd";
import Draggable from "react-draggable";
// import { Resizable } from "re-resizable";

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color: string) {
  if (!color) return;
  const [r, g, b] = color
    .slice(4, color.length - 1)
    .split(",")
    .map((e) => parseInt(e));
  // console.log(r, r.toString(16));
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  console.log(rect);
  return rect;
}

const exportComp = async (ref: RefObject<HTMLElement>) => {
  const canvas = await html2canvas(ref.current),
    data = canvas.toDataURL("image/jpg"),
    link = document.createElement("a");
  link.href = data;
  link.download = "downloaded-image.jpg";
  document.body.appendChild(link);
  link.click();
  alert("Image Downloaded");
  document.body.removeChild(link);
};

const MemeComponent = () => {
  const [source, setSource] = useState("");
  const { data, loading, error } = usePalette(source, 3, "rgbString");
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [active, setActive] = useState<HTMLElement>(null);
  const [reload, setReload] = useState(true);
  const downloadRef: RefObject<HTMLElement> = useRef<HTMLElement>(null);
  const bgimageContainerRef: RefObject<HTMLElement> = useRef<HTMLElement>(null);
  // console.log(
  //   "🚀 ~ file: index.tsx ~ line 11 ~ MemeComponent ~ active",
  //   active,
  //   elements
  // );
  // console.log(data);
  // useEffect(() => {
  // }, [source]);
  return (
    <section className={styles[`meme-container`]}>
      {/* <canvas> */}
      <section
        style={{
          display: "flex",
          padding: "0 4vmax",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          width: "100%",
          boxSizing: "border-box",
          gap: window.innerWidth < 768 ? "6vmin" : 0,
        }}
      >
        <section>
          <section className={styles[`elements-list`]}>
            {elements.map((el) => {
              const isActive =
                active &&
                (el.props.children.props.uid === active.getAttribute("uid") ||
                  el.props.children.props.uid === active.getAttribute("uid"));
              const isImage = Boolean(el.props.children.type === "img");
              return (
                <p
                  className={`${styles[`elements-list-item`]} ${
                    isActive && styles[`elements-list-item--active`]
                  }`}
                  onClick={(e) => {
                    const el1: HTMLElement =
                      document.querySelector(
                        `[uid=${el.props.children.props.uid}]`
                      ) ||
                      document.querySelector(
                        `[uid=${el.props.children.props.uid}]`
                      );
                    setActive(el1);
                  }}
                >
                  {isImage ? <BiImage /> : <BiText />}
                  {el.props.children.props.uid || el.props.children.props.uid}
                </p>
              );
            })}
          </section>
          {active ? (
            <section className={styles[`active-container`]}>
              <h3>Active Element</h3>
              <br />
              <section className={styles[`active-info`]}>
                {active.tagName === "P" ? <BiText /> : <BiImage />}
                <input
                  type="text"
                  value={
                    window.innerWidth > 768
                      ? active.getAttribute("uid")
                      : active.innerText
                  }
                  onChange={(e) => {
                    if (window.innerWidth > 768) {
                      active.setAttribute("uid", e.target.value);
                    } else {
                      active.innerText = e.target.value;
                    }
                    setReload(!reload);
                  }}
                />
                <BiTrash
                  style={{ color: "red", fontSize: "1.4rem" }}
                  onClick={() => {
                    console.log(active.getAttribute("uid"));
                    setElements((elements) =>
                      elements.filter((el) => {
                        return (
                          el.props.children.props.uid !==
                            active.getAttribute("uid") &&
                          el.props.children.props.uid !==
                            active.getAttribute("uid")
                        );
                      })
                    );
                    setActive(null);
                  }}
                />
              </section>
              {active.tagName === "P" ? (
                <section className={styles[`active-modifier`]}>
                  <section className={styles[`modifier-section`]}>
                    <p className={styles[`modifier-heading`]}>
                      <BiBold /> Bold
                    </p>
                    <input
                      type="range"
                      name="bold"
                      id="bold"
                      max={900}
                      min={300}
                      step={100}
                      value={active.style.fontWeight}
                      onChange={(e) => {
                        active.style.fontWeight = e.target.value;
                        setReload(!reload);
                      }}
                    />
                  </section>
                  <section className={styles[`modifier-section`]}>
                    <p className={styles[`modifier-heading`]}>
                      <BiFontSize /> Font Size
                    </p>
                    <input
                      type="range"
                      name="size"
                      id="size"
                      max={50}
                      min={8}
                      step={2}
                      value={active.style.fontSize.split("p")[0]}
                      onChange={(e) => {
                        // console.log(active.style.fontSize);
                        active.style.fontSize = e.target.value + "px";
                        setReload(!reload);
                      }}
                    />
                  </section>
                  <section className={styles[`modifier-section`]}>
                    <p className={styles[`modifier-heading`]}>
                      <BiFontColor /> Font Color
                    </p>
                    <input
                      type="color"
                      name="color"
                      id="color"
                      value={rgbToHex(active?.style?.color)}
                      onChange={(e) => {
                        console.log(e.target.value);
                        active.style.color = e.target.value;
                        setReload(!reload);
                      }}
                    />
                  </section>
                  <section className={styles[`modifier-section`]}>
                    <p className={styles[`modifier-heading`]}>
                      <BiFontColor /> Background Color
                    </p>
                    <input
                      type="color"
                      name="b-color"
                      id="b-color"
                      value={rgbToHex(active?.style?.backgroundColor)}
                      onChange={(e) => {
                        console.log(e.target.value);
                        active.style.backgroundColor = e.target.value;
                        setReload(!reload);
                      }}
                    />
                  </section>
                </section>
              ) : null}
            </section>
          ) : null}
        </section>
        <section className={styles.meme} ref={downloadRef}>
          <section
            className={styles[`image-container`]}
            ref={bgimageContainerRef}
            style={{
              background: data
                ? `linear-gradient(to bottom, ${data?.[0]},${data?.[1]},${data?.[2]})`
                : "#777",
            }}
          >
            {bgimageContainerRef.current ? (
              <Rnd
                default={{
                  x: 0,
                  y: 0,
                  width: bgimageContainerRef.current.clientWidth,
                  height: bgimageContainerRef.current.clientHeight,
                }}
                // onResizeStart={(e) => {
                //   e.stopPropagation();
                // }}
              >
                <img src={source} />
              </Rnd>
            ) : null}
          </section>
          {elements}
        </section>
        <section className={styles.toolbar}>
          <p
            className={styles[`toolbar-button`]}
            onClick={() => {
              setElements((el) => [
                ...el,
                <Draggable>
                  {/* // <section> */}
                  <p
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    className={styles[`default-text`]}
                    // onInput={(e) => {
                    //   //@ts-ignore
                    //   if (!e.target.innerText) {
                    //     setElements((elements) =>
                    //       elements.filter((el) => {
                    //         return (
                    //           el.props.children.props.uid !==
                    //           //@ts-ignore
                    //           e.target.getAttribute("uid")
                    //         );
                    //       })
                    //     );
                    //     setActive(null);
                    //   }
                    // }}
                    //@ts-ignore
                    uid={`Text-${elements.length + 1}`}
                    onClick={(e) => {
                      console.log("clicked");
                      //@ts-ignore
                      setActive(e.target);
                    }}
                  >
                    What Do You Want To Write?&nbsp;
                  </p>
                  {/* </section>, */}
                </Draggable>,
              ]);
            }}
          >
            <BiText /> Text
          </p>
          <label className={styles[`toolbar-button`]} htmlFor="additional-img">
            <BiImage /> Image
          </label>
          <input
            type="file"
            name="image"
            style={{ display: "none" }}
            onChange={(e) => {
              // console.log(e.target.files);
              const image = e.target.files?.[0];
              if (!image) return;
              const src = URL.createObjectURL(image);
              // setSource(src);
              setElements((el) => [
                ...el,
                <Rnd
                  defaultSize={{
                    x: 0,
                    y: 0,
                    width: 400,
                    height: 400,
                  }}
                  onResizeStart={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={src}
                    className={styles[`default-img`]}
                    //@ts-ignore
                    uid={`Image-${elements.length + 1}`}
                    onClick={(e) => {
                      //@ts-ignore
                      setActive(e.target);
                    }}
                  />
                </Rnd>,
              ]);
            }}
            id="additional-img"
            accept="image/*"
          />
          <p
            className={styles[`toolbar-button`]}
            onClick={() => exportComp(downloadRef)}
          >
            Export
          </p>
        </section>
      </section>
      {/* </canvas> */}
      <input
        type="file"
        name="image"
        onChange={(e) => {
          // console.log(e.target.files);
          const image = e.target.files?.[0];
          if (!image) return;
          const src = URL.createObjectURL(image);
          setSource(src);
        }}
        id="image"
        accept="image/*"
      />
    </section>
  );
};

export default MemeComponent;
