export const ScrollIcon = ({
  color,
  width,
  height,
}: {
  color: string;
  width: string;
  height: string;
}) => {
  return (
    <div className={`${height} ${width}`}>
      <svg
        width="24"
        height="24"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 298.246 298.246"
        xmlSpace="preserve"
      >
        <g>
          <g>
            <g>
              <polygon
                style={{ fill: color }}
                points="139.95,35.115 139.95,128.384 158.296,128.384 158.296,35.115 196.538,73.351 209.51,60.379 149.12,0 88.736,60.374 101.691,73.357"
              />
            </g>
            <g>
              <polygon
                style={{ fill: color }}
                points="128.386,158.299 128.386,139.947 35.248,139.947 73.49,101.711 60.512,88.733 0.122,149.123 60.512,209.518 73.49,196.541 35.242,158.299"
              />
            </g>
            <g>
              <polygon
                style={{ fill: color }}
                points="158.296,263.131 158.296,169.862 139.95,169.862 139.95,263.126 101.708,224.884 88.73,237.856 149.12,298.246 209.51,237.861 196.549,224.878"
              />
            </g>
            <g>
              <polygon
                style={{ fill: color }}
                points="237.728,88.733 224.756,101.689 262.998,139.947 169.859,139.947 169.859,158.299 262.998,158.299 224.756,196.53 237.717,209.518 298.123,149.123"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
 
