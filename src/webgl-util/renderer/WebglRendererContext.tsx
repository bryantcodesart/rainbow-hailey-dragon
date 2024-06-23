import { createContext } from "react";
import { WebGLRenderer } from "./WebGLRenderer";

export const WebglRendererContext = createContext<WebGLRenderer | null>(null);
