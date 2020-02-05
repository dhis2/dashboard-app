import React from 'react';
// import { colors } from '@dhis2/ui-core';
import PropTypes from 'prop-types';
import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_BUBBLE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics';



const VisIcon = ({ name, style }) => {
    switch (name) {
        case VIS_TYPE_COLUMN:
            return (
                <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={style}
                >
                    <title>icon/chart-type/16/column</title>
                    <desc>Created with Sketch.</desc>
                    <g
                        id="icon/chart-type/16/column"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                    >
                        <g id="Group" fill="#7B8998">
                            <rect
                                id="Rectangle"
                                x="0"
                                y="15"
                                width="16"
                                height="1"
                            />
                            <rect
                                id="Rectangle"
                                x="0"
                                y="0"
                                width="1"
                                height="16"
                            />
                            <rect
                                id="Rectangle"
                                x="13"
                                y="8"
                                width="3"
                                height="7"
                            />
                            <rect
                                id="Rectangle"
                                x="8"
                                y="2"
                                width="3"
                                height="13"
                            />
                            <rect
                                id="Rectangle"
                                x="3"
                                y="4"
                                width="3"
                                height="11"
                            />
                        </g>
                    </g>
                </svg>
            );
        case VIS_TYPE_STACKED_COLUMN:return (
                                         <svg
                                             style={style}
                                              width="16px"
                                             height="16px"
                                             viewBox="0 0 16 16"
                                             version="1.1"
                                             xmlns="http://www.w3.org/2000/svg"
                                             xmlnsXlink="http://www.w3.org/1999/xlink"
                                         >
                                             <title>
                                                 icon/chart-type/16/stacked-column
                                             </title>
                                             <desc>Created with Sketch.</desc>
                                             <g
                                                 id="icon/chart-type/16/stacked-column"
                                                 stroke="none"
                                                 strokeWidth="1"
                                                 fill="none"
                                                 fillRule="evenodd"
                                             >
                                                 <g id="Group" fill="#7B8998">
                                                     <rect
                                                         id="Rectangle"
                                                         x="0"
                                                         y="15"
                                                         width="16"
                                                         height="1"
                                                     />
                                                     <rect
                                                         id="Rectangle"
                                                         x="0"
                                                         y="0"
                                                         width="1"
                                                         height="16"
                                                     />
                                                     <rect
                                                         id="Rectangle"
                                                         x="13"
                                                         y="8"
                                                         width="3"
                                                         height="7"
                                                     />
                                                     <rect
                                                         id="Rectangle"
                                                         x="13"
                                                         y="4"
                                                         width="3"
                                                         height="3"
                                                     />
                                                     <rect
                                                         id="Rectangle"
                                                         x="8"
                                                         y="9"
                                                         width="3"
                                                         height="6"
                                                     />
                                                     <rect
                                                         id="Rectangle"
                                                         x="8"
                                                         y="1"
                                                         width="3"
                                                         height="7"
                                                     />
                                                     <rect
                                                         id="Rectangle"
                                                         x="3"
                                                         y="13"
                                                         width="3"
                                                         height="2"
                                                     />
                                                     <rect
                                                         id="Rectangle"
                                                         x="3"
                                                         y="7"
                                                         width="3"
                                                         height="5"
                                                     />
                                                 </g>
                                             </g>
                                         </svg>
                                     );
        case VIS_TYPE_BAR:return (
                              <svg
                                  style={style}
                                   width="16px"
                                  height="16px"
                                  viewBox="0 0 16 16"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                  <title>icon/chart-type/16/bar</title>
                                  <desc>Created with Sketch.</desc>
                                  <g
                                      id="icon/chart-type/16/bar"
                                      stroke="none"
                                      strokeWidth="1"
                                      fill="none"
                                      fillRule="evenodd"
                                  >
                                      <g id="Group" fill="#7B8998">
                                          <rect
                                              id="Rectangle"
                                              x="0"
                                              y="15"
                                              width="16"
                                              height="1"
                                          />
                                          <rect
                                              id="Rectangle"
                                              x="0"
                                              y="0"
                                              width="1"
                                              height="16"
                                          />
                                          <rect
                                              id="Rectangle"
                                              x="1"
                                              y="10"
                                              width="13"
                                              height="3"
                                          />
                                          <rect
                                              id="Rectangle"
                                              x="1"
                                              y="5"
                                              width="10"
                                              height="3"
                                          />
                                          <rect
                                              id="Rectangle"
                                              x="1"
                                              y="0"
                                              width="5"
                                              height="3"
                                          />
                                      </g>
                                  </g>
                              </svg>
                          );
        case VIS_TYPE_STACKED_BAR:return (
                                      <svg
                                          style={style}
                                          width="16px"
                                          height="16px"
                                          viewBox="0 0 16 16"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                      >
                                          <title>
                                              icon/chart-type/16/stacked-bar
                                          </title>
                                          <desc>Created with Sketch.</desc>
                                          <g
                                              id="icon/chart-type/16/stacked-bar"
                                              stroke="none"
                                              strokeWidth="1"
                                              fill="none"
                                              fillRule="evenodd"
                                          >
                                              <g id="Group" fill="#7B8998">
                                                  <rect
                                                      id="Rectangle"
                                                      x="0"
                                                      y="15"
                                                      width="16"
                                                      height="1"
                                                  />
                                                  <rect
                                                      id="Rectangle"
                                                      x="0"
                                                      y="0"
                                                      width="1"
                                                      height="16"
                                                  />
                                                  <rect
                                                      id="Rectangle"
                                                      x="1"
                                                      y="10"
                                                      width="6"
                                                      height="3"
                                                  />
                                                  <rect
                                                      id="Rectangle"
                                                      x="8"
                                                      y="10"
                                                      width="6"
                                                      height="3"
                                                  />
                                                  <rect
                                                      id="Rectangle"
                                                      x="1"
                                                      y="5"
                                                      width="3"
                                                      height="3"
                                                  />
                                                  <rect
                                                      id="Rectangle"
                                                      x="5"
                                                      y="5"
                                                      width="5"
                                                      height="3"
                                                  />
                                                  <rect
                                                      id="Rectangle"
                                                      x="1"
                                                      y="0"
                                                      width="4"
                                                      height="3"
                                                  />
                                                  <rect
                                                      id="Rectangle"
                                                      x="6"
                                                      y="0"
                                                      width="3"
                                                      height="3"
                                                  />
                                              </g>
                                          </g>
                                      </svg>
                                  );
        case VIS_TYPE_LINE:return (
                               <svg
                                   style={style}
                                    width="16px"
                                   height="16px"
                                   viewBox="0 0 16 16"
                                   version="1.1"
                                   xmlns="http://www.w3.org/2000/svg"
                                   xmlnsXlink="http://www.w3.org/1999/xlink"
                               >
                                   <title>icon/chart-type/16/line</title>
                                   <desc>Created with Sketch.</desc>
                                   <defs>
                                       <rect
                                           id="path-1"
                                           x="0"
                                           y="0"
                                           width="16"
                                           height="16"
                                       />
                                   </defs>
                                   <g
                                       id="icon/chart-type/16/line"
                                       stroke="none"
                                       strokeWidth="1"
                                       fill="none"
                                       fillRule="evenodd"
                                   >
                                       <g id="Group">
                                           <mask id="mask-2" fill="white">
                                               <use xlinkHref="#path-1" />
                                           </mask>
                                           <g id="Rectangle" />
                                           <rect
                                               id="Rectangle"
                                               fill="#7B8998"
                                               mask="url(#mask-2)"
                                               x="0"
                                               y="15"
                                               width="16"
                                               height="1"
                                           />
                                           <rect
                                               id="Rectangle"
                                               fill="#7B8998"
                                               mask="url(#mask-2)"
                                               x="0"
                                               y="0"
                                               width="1"
                                               height="16"
                                           />
                                           <polyline
                                               id="Path"
                                               stroke="#7B8998"
                                               strokeWidth="1.5"
                                               mask="url(#mask-2)"
                                               points="0 5 5 9 9 7 15 12"
                                           />
                                       </g>
                                   </g>
                               </svg>
                           );
        case VIS_TYPE_AREA:return (
                               <svg
                                   style={style}
                                width="16px"
                                   height="16px"
                                   viewBox="0 0 16 16"
                                   version="1.1"
                                   xmlns="http://www.w3.org/2000/svg"
                                   xmlnsXlink="http://www.w3.org/1999/xlink"
                               >
                                   <title>icon/chart-type/16/area</title>
                                   <desc>Created with Sketch.</desc>
                                   <defs>
                                       <rect
                                           id="path-1"
                                           x="0"
                                           y="0"
                                           width="16"
                                           height="16"
                                       />
                                   </defs>
                                   <g
                                       id="icon/chart-type/16/area"
                                       stroke="none"
                                       strokeWidth="1"
                                       fill="none"
                                       fillRule="evenodd"
                                   >
                                       <g id="Group">
                                           <mask id="mask-2" fill="white">
                                               <use xlinkHref="#path-1" />
                                           </mask>
                                           <g id="Rectangle" />
                                           <rect
                                               id="Rectangle"
                                               fill="#7B8998"
                                               mask="url(#mask-2)"
                                               x="0"
                                               y="15"
                                               width="16"
                                               height="1"
                                           />
                                           <rect
                                               id="Rectangle"
                                               fill="#7B8998"
                                               mask="url(#mask-2)"
                                               x="0"
                                               y="0"
                                               width="1"
                                               height="16"
                                           />
                                           <polygon
                                               id="Path"
                                               stroke="#7B8998"
                                               strokeWidth="1.5"
                                               fill="#7B8998"
                                               mask="url(#mask-2)"
                                               points="3 5 7 9 10 7 15 12 15 13 3 13"
                                           />
                                       </g>
                                   </g>
                               </svg>
                           );
        case VIS_TYPE_PIE:return (
                              <svg
                                  style={style}
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 16 16"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                  <title>icon/chart-type/16/pie</title>
                                  <desc>Created with Sketch.</desc>
                                  <g
                                      id="icon/chart-type/16/pie"
                                      stroke="none"
                                      strokeWidth="1"
                                      fill="none"
                                      fillRule="evenodd"
                                  >
                                      <g
                                          id="Variable-segments-circle"
                                          transform="translate(-1.000000, 0.000000)"
                                      >
                                          <path
                                              d="M9,0 C11.86,0 14.5,1.52 15.93,4 C17.36,6.48 17.36,9.52 15.93,12 C14.5,14.48 11.86,16 9,16 C6.14,16 3.5,14.48 2.07,12 C0.64,9.52 0.64,6.48 2.07,4 C3.5,1.52 6.14,0 9,0 L9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 L9,0 Z"
                                              id="Base-plate"
                                              fillOpacity="0.002"
                                              fill="#455A64"
                                          />
                                          <path
                                              d="M9.25,0.253999142 L9.25,7.62589712 L16.0605377,4.80583684 C15.9597575,4.58208479 15.8426843,4.35299631 15.7134245,4.12488021 C14.3709859,1.79673487 11.9260373,0.33967375 9.25,0.253999142 Z"
                                              id="Segment-3"
                                              stroke="#FFFFFF"
                                              strokeWidth="0.5"
                                              fill="#7B8998"
                                          />
                                          <path
                                              d="M16.2507321,5.26825168 L9.25,8.16706634 L9.25,15.7459734 C11.5677905,15.6712788 13.7388491,14.5610154 15.1515843,12.7179105 C16.7838303,10.5884861 17.1923733,7.7729977 16.2507321,5.26825168 Z"
                                              id="Segment-5"
                                              stroke="#FFFFFF"
                                              strokeWidth="0.5"
                                              fill="#7B8998"
                                          />
                                          <path
                                              d="M8.75,15.7460009 L8.75,0.253999142 C6.07396269,0.33967375 3.62901411,1.79673487 2.28657547,4.12488021 C0.901141511,6.52759085 0.901141511,9.47240915 2.28657547,11.8751198 C3.62901411,14.2032651 6.07396269,15.6603262 8.75,15.7460009 Z"
                                              id="Segment-8"
                                              stroke="#FFFFFF"
                                              strokeWidth="0.5"
                                              fill="#7B8998"
                                          />
                                      </g>
                                      <g
                                          id="Variable-segments-circle"
                                          transform="translate(-1.000000, 0.000000)"
                                      >
                                          <path
                                              d="M9,0 C11.86,0 14.5,1.52 15.93,4 C17.36,6.48 17.36,9.52 15.93,12 C14.5,14.48 11.86,16 9,16 C6.14,16 3.5,14.48 2.07,12 C0.64,9.52 0.64,6.48 2.07,4 C3.5,1.52 6.14,0 9,0 L9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 C9,8 9,8 9,8 L9,0 Z"
                                              id="Base-plate"
                                              fillOpacity="0.002"
                                              fill="#455A64"
                                          />
                                          <path
                                              d="M9.25,0.253999142 L9.25,7.87969351 L15.208572,12.6370174 C15.3964843,12.3885798 15.5650482,12.1347754 15.7134245,11.8751198 C17.0988585,9.47240915 17.0988585,6.52759085 15.7134245,4.12488021 C14.3709859,1.79673487 11.9260373,0.33967375 9.25,0.253999142 Z"
                                              id="Segment-5"
                                              stroke="#FFFFFF"
                                              strokeWidth="0.5"
                                              fill="#7B8998"
                                          />
                                          <path
                                              d="M14.8955472,13.0269114 L9.08920592,8.3911285 L5.86513188,15.0901411 C6.48561254,15.3656722 7.15156976,15.5571176 7.84755483,15.6628368 C10.5003854,16.0659171 13.160928,15.0629335 14.8955472,13.0269114 Z"
                                              id="Segment-3"
                                              stroke="#FFFFFF"
                                              strokeWidth="0.5"
                                              fill="#7B8998"
                                          />
                                          <path
                                              d="M5.41482695,14.8728263 L8.75,7.94297101 L8.75,0.253977185 C7.27404265,0.301055104 5.8471024,0.764373723 4.63088851,1.5965198 C2.34652789,3.15491836 1.06570164,5.81818129 1.26932408,8.58162875 C1.46659354,11.2588571 3.03960782,13.6359852 5.41482695,14.8728263 Z"
                                              id="Segment-6"
                                              stroke="#FFFFFF"
                                              strokeWidth="0.5"
                                              fill="#7B8998"
                                          />
                                      </g>
                                  </g>
                              </svg>
                          );
        case VIS_TYPE_RADAR:return (
                                <svg
                                    style={style}
                                    width="16px"
                                    height="16px"
                                    viewBox="0 0 16 16"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <title>icon/chart-type/16/radar</title>
                                    <desc>Created with Sketch.</desc>
                                    <g
                                        id="icon/chart-type/16/radar"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <circle
                                            id="Oval"
                                            stroke="#7B8998"
                                            cx="8"
                                            cy="8"
                                            r="6"
                                        />
                                        <circle
                                            id="Oval"
                                            stroke="#7B8998"
                                            cx="8"
                                            cy="8"
                                            r="3"
                                        />
                                        <circle
                                            id="Oval"
                                            fill="#7B8998"
                                            cx="8"
                                            cy="2"
                                            r="2"
                                        />
                                        <circle
                                            id="Oval"
                                            fill="#7B8998"
                                            cx="3"
                                            cy="12"
                                            r="2"
                                        />
                                    </g>
                                </svg>
                            );
        case VIS_TYPE_GAUGE:return (<svg style={style} width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <title>icon/chart-type/16/gauge</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <polygon id="path-1" points="0 0 16 0 16 16 0 16"></polygon>
    </defs>
    <g id="icon/chart-type/16/gauge" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="icon_chart_gauge">
            <mask id="mask-2" fill="white">
                <use xlinkHref="#path-1"></use>
            </mask>
            <g id="Bounds"></g>
        </g>
        <path d="M15,12 C15,8.13400675 11.8659932,5 8,5 C4.13400675,5 1,8.13400675 1,12" id="Path" stroke="#7B8998"></path>
        <g id="Segments-circle" transform="translate(1.000000, 6.000000)">
            <path d="M7,0 C9.14,0 11.13,1.14 12.2,3 C13.27,4.86 13.27,7.14 12.2,9 C11.13,10.86 9.14,12 7,12 C4.86,12 2.87,10.86 1.8,9 C0.73,7.14 0.73,4.86 1.8,3 C2.87,1.14 4.86,0 7,0 L7,3 C5.93,3 4.94,3.57 4.4,4.5 C3.86,5.43 3.86,6.57 4.4,7.5 C4.94,8.43 5.93,9 7,9 C8.07,9 9.06,8.43 9.6,7.5 C10.14,6.57 10.14,5.43 9.6,4.5 C9.06,3.57 8.07,3 7,3 L7,0 Z" id="Base-plate" fillOpacity="0.002" fill="#455A64"></path>
            <path d="M1,6 C1,3.86 2.14,1.87 4,0.8 C4.91,0.27 5.95,0 7,0 L7,3 C5.93,3 4.94,3.57 4.4,4.5 C4.14,4.96 4,5.47 4,6 L1,6 Z" id="Segment-4" fill="#7B8998"></path>
        </g>
    </g>
</svg>)
        case VIS_TYPE_BUBBLE:return (
                                 <svg
                                     style={style}
                                     width="16px"
                                     height="16px"
                                     viewBox="0 0 16 16"
                                     version="1.1"
                                     xmlns="http://www.w3.org/2000/svg"
                                     xmlnsXlink="http://www.w3.org/1999/xlink"
                                 >
                                     <title>icon/chart-type/16/bubble</title>
                                     <desc>Created with Sketch.</desc>
                                     <g
                                         id="icon/chart-type/16/bubble"
                                         stroke="none"
                                         strokeWidth="1"
                                         fill="none"
                                         fillRule="evenodd"
                                     >
                                         <g id="Group" fill="#7B8998">
                                             <rect
                                                 id="Rectangle"
                                                 x="0"
                                                 y="15"
                                                 width="16"
                                                 height="1"
                                             />
                                             <rect
                                                 id="Rectangle"
                                                 x="0"
                                                 y="0"
                                                 width="1"
                                                 height="16"
                                             />
                                         </g>
                                         <circle
                                             id="Oval"
                                             fill="#7B8998"
                                             cx="6"
                                             cy="10"
                                             r="3"
                                         />
                                         <circle
                                             id="Oval"
                                             fill="#7B8998"
                                             cx="8.5"
                                             cy="3.5"
                                             r="1.5"
                                         />
                                         <circle
                                             id="Oval"
                                             fill="#7B8998"
                                             cx="12"
                                             cy="8"
                                             r="2"
                                         />
                                     </g>
                                 </svg>
                             );
        case VIS_TYPE_YEAR_OVER_YEAR_LINE:return (
                                              <svg
                                                  style={style}
                                                  width="16px"
                                                  height="16px"
                                                  viewBox="0 0 16 16"
                                                  version="1.1"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                              >
                                                  <title>
                                                      icon/chart-type/16/yoy-line
                                                  </title>
                                                  <desc>
                                                      Created with Sketch.
                                                  </desc>
                                                  <defs>
                                                      <rect
                                                          id="path-1"
                                                          x="0"
                                                          y="0"
                                                          width="16"
                                                          height="16"
                                                      />
                                                  </defs>
                                                  <g
                                                      id="icon/chart-type/16/yoy-line"
                                                      stroke="none"
                                                      strokeWidth="1"
                                                      fill="none"
                                                      fillRule="evenodd"
                                                  >
                                                      <g id="Group">
                                                          <mask
                                                              id="mask-2"
                                                              fill="white"
                                                          >
                                                              <use xlinkHref="#path-1" />
                                                          </mask>
                                                          <g id="Rectangle" />
                                                          <rect
                                                              id="Rectangle"
                                                              fill="#7B8998"
                                                              mask="url(#mask-2)"
                                                              x="0"
                                                              y="15"
                                                              width="16"
                                                              height="1"
                                                          />
                                                          <rect
                                                              id="Rectangle"
                                                              fill="#7B8998"
                                                              mask="url(#mask-2)"
                                                              x="0"
                                                              y="0"
                                                              width="1"
                                                              height="16"
                                                          />
                                                          <polyline
                                                              id="Path"
                                                              stroke="#7B8998"
                                                              strokeWidth="1.5"
                                                              mask="url(#mask-2)"
                                                              points="0 5 5 10 10 6 15 12"
                                                          />
                                                          <polyline
                                                              id="Path"
                                                              stroke="#7B8998"
                                                              strokeWidth="1.5"
                                                              mask="url(#mask-2)"
                                                              points="0 10 5 2 10 12 15 4"
                                                          />
                                                      </g>
                                                  </g>
                                              </svg>
                                          );
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:return (
                                                <svg
                                                    style={style}
                                                    width="16px"
                                                    height="16px"
                                                    viewBox="0 0 16 16"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                >
                                                    <title>
                                                        icon/chart-type/16/yoy-column
                                                    </title>
                                                    <desc>
                                                        Created with Sketch.
                                                    </desc>
                                                    <g
                                                        id="icon/chart-type/16/yoy-column"
                                                        stroke="none"
                                                        strokeWidth="1"
                                                        fill="none"
                                                        fillRule="evenodd"
                                                    >
                                                        <g
                                                            id="Group"
                                                            fill="#7B8998"
                                                        >
                                                            <rect
                                                                id="Rectangle"
                                                                x="0"
                                                                y="15"
                                                                width="16"
                                                                height="1"
                                                            />
                                                            <rect
                                                                id="Rectangle"
                                                                x="0"
                                                                y="0"
                                                                width="1"
                                                                height="16"
                                                            />
                                                            <rect
                                                                id="Rectangle"
                                                                x="14"
                                                                y="9"
                                                                width="2"
                                                                height="6"
                                                            />
                                                            <rect
                                                                id="Rectangle"
                                                                x="11"
                                                                y="2"
                                                                width="2"
                                                                height="13"
                                                            />
                                                            <rect
                                                                id="Rectangle"
                                                                x="3"
                                                                y="11"
                                                                width="2"
                                                                height="4"
                                                            />
                                                            <rect
                                                                id="Rectangle"
                                                                x="6"
                                                                y="9"
                                                                width="2"
                                                                height="6"
                                                            />
                                                        </g>
                                                    </g>
                                                </svg>
                                            );
        case VIS_TYPE_SINGLE_VALUE:return (
                                       <svg
                                           style={style}
                                           width="16px"
                                           height="16px"
                                           viewBox="0 0 16 16"
                                           version="1.1"
                                           xmlns="http://www.w3.org/2000/svg"
                                           xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                           <title>
                                               icon/chart-type/16/single-value
                                           </title>
                                           <desc>Created with Sketch.</desc>
                                           <g
                                               id="icon/chart-type/16/single-value"
                                               stroke="none"
                                               strokeWidth="1"
                                               fill="none"
                                               fillRule="evenodd"
                                           >
                                               <path
                                                   d="M3.85595703,11 L2.37060547,11 L2.37060547,6.27148438 L0.911621094,6.69775391 L0.911621094,5.57275391 L3.71972656,4.6015625 L3.85595703,4.6015625 L3.85595703,11 Z M10.25,11 L5.78515625,11 L5.78515625,10.0332031 L7.84179688,7.87109375 C8.34863535,7.29394243 8.60205078,6.83545092 8.60205078,6.49560547 C8.60205078,6.22021347 8.54199279,6.01074291 8.421875,5.8671875 C8.30175721,5.72363209 8.12744255,5.65185547 7.89892578,5.65185547 C7.67333872,5.65185547 7.49023508,5.74780177 7.34960938,5.93969727 C7.20898367,6.13159276 7.13867188,6.37109231 7.13867188,6.65820312 L5.65332031,6.65820312 C5.65332031,6.26562304 5.75146386,5.90307783 5.94775391,5.57055664 C6.14404395,5.23803545 6.41650216,4.97802828 6.76513672,4.79052734 C7.11377127,4.60302641 7.50341582,4.50927734 7.93408203,4.50927734 C8.62549174,4.50927734 9.15795712,4.66894372 9.53149414,4.98828125 C9.90503116,5.30761878 10.0917969,5.76611029 10.0917969,6.36376953 C10.0917969,6.61572392 10.0449223,6.86108279 9.95117188,7.09985352 C9.85742141,7.33862424 9.71167091,7.58911002 9.51391602,7.85131836 C9.31616112,8.1135267 8.99756079,8.46435327 8.55810547,8.90380859 L7.73193359,9.85742188 L10.25,9.85742188 L10.25,11 Z M12.3505859,7.18115234 L13.0493164,7.18115234 C13.6030301,7.18115234 13.8798828,6.91015896 13.8798828,6.36816406 C13.8798828,6.15722551 13.8139655,5.98510809 13.6821289,5.85180664 C13.5502923,5.71850519 13.364259,5.65185547 13.1240234,5.65185547 C12.9277334,5.65185547 12.7570808,5.7089838 12.6120605,5.82324219 C12.4670403,5.93750057 12.3945312,6.07958899 12.3945312,6.24951172 L10.9135742,6.24951172 C10.9135742,5.91259597 11.0073233,5.61230601 11.1948242,5.34863281 C11.3823252,5.08495962 11.6423323,4.87915113 11.9748535,4.73120117 C12.3073747,4.58325121 12.6728496,4.50927734 13.0712891,4.50927734 C13.7832067,4.50927734 14.3427714,4.67187337 14.75,4.99707031 C15.1572286,5.32226725 15.3608398,5.76904013 15.3608398,6.33740234 C15.3608398,6.61279435 15.2766122,6.87280151 15.1081543,7.11743164 C14.9396964,7.36206177 14.6943375,7.56054611 14.3720703,7.71289062 C14.7119158,7.83593812 14.9785147,8.02270383 15.171875,8.27319336 C15.3652353,8.52368289 15.4619141,8.83349425 15.4619141,9.20263672 C15.4619141,9.77392864 15.2421897,10.2309553 14.8027344,10.5737305 C14.3632791,10.9165056 13.7861364,11.0878906 13.0712891,11.0878906 C12.6523417,11.0878906 12.2634295,11.0080574 11.904541,10.8483887 C11.5456525,10.6887199 11.2739267,10.4675307 11.0893555,10.1848145 C10.9047842,9.9020982 10.8125,9.58056821 10.8125,9.22021484 L12.3022461,9.22021484 C12.3022461,9.41650489 12.3813469,9.58642506 12.5395508,9.72998047 C12.6977547,9.87353587 12.892577,9.9453125 13.1240234,9.9453125 C13.3847669,9.9453125 13.5927727,9.87280346 13.7480469,9.7277832 C13.9033211,9.58276295 13.980957,9.39746207 13.980957,9.171875 C13.980957,8.84960776 13.9003914,8.62109442 13.7392578,8.48632812 C13.5781242,8.35156183 13.3554702,8.28417969 13.0712891,8.28417969 L12.3505859,8.28417969 L12.3505859,7.18115234 Z"
                                                   id="123"
                                                   fill="#7B8998"
                                                   fillRule="nonzero"
                                               />
                                           </g>
                                       </svg>
                                   );
        case VIS_TYPE_PIVOT_TABLE:return (
                                      <svg
                                          style={style}
                                          width="16px"
                                          height="16px"
                                          viewBox="0 0 16 16"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                      >
                                          <title>
                                              icon/chart-type/16/pivot-table
                                          </title>
                                          <desc>Created with Sketch.</desc>
                                          <g
                                              id="icon/chart-type/16/pivot-table"
                                              stroke="none"
                                              strokeWidth="1"
                                              fill="none"
                                              fillRule="evenodd"
                                          >
                                              <g id="icon-no-bg">
                                                  <polygon
                                                      id="Rectangle-2"
                                                      fill="#7B8998"
                                                      points="1 11 15 11 15 12 1 12"
                                                  />
                                                  <polygon
                                                      id="Rectangle-2"
                                                      fill="#7B8998"
                                                      points="6 1 7 1 7 15 6 15"
                                                  />
                                                  <polygon
                                                      id="Rectangle-2"
                                                      fill="#7B8998"
                                                      points="1 6 15 6 15 7 1 7"
                                                  />
                                                  <rect
                                                      id="Rectangle-2"
                                                      stroke="#7B8998"
                                                      x="0.5"
                                                      y="0.5"
                                                      width="15"
                                                      height="15"
                                                  />
                                              </g>
                                          </g>
                                      </svg>
                                  );
    }
};

VisIcon.propTypes = {
    name: PropTypes.string,
};

export default VisIcon;
