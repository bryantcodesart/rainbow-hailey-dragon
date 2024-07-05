import { WebGLCanvas } from "./webgl-util/renderer/WebglCanvas";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";
import { HaileyDragon } from "./programs/HaileyDragon";
import { ControlsTunnel } from "./tunnels/ControlsTunnel";
import * as Tone from "tone";
import { ReactNode, useEffect, useState } from "react";

// Create a context provider component
function ToneProvider({ children }: { children: ReactNode }) {
  const [audioStarted, setAudioStarted] = useState(false);

  return (
    <>
      {children}
      <AnimatePresence>
        {!audioStarted && (
          <motion.div
            data-debug-name="allow-audio-mask"
            className="grid fixed inset-0 z-[--z-allow-audio-mask] place-items-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="p-4 border-2 border-white"
              data-debug-name="allow-audio"
              onClick={() => {
                const startAudio = async () => {
                  await Tone.start();
                  setAudioStarted(true);
                };
                startAudio();
              }}
            >
              Begin
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// function Track({ name, src }: { name: string; src: string }) {
//   useEffect(() => {
//     const track = new Tone.Player(src).toDestination();
//     track.autostart = true;
//     track.loop = true;
//     return () => {
//       track.dispose();
//     };
//   }, [src]);
//   return null;
// }

function AudioLooper({
  tracks,
  children,
  nBeatsPerMinute,
  nMeasuresInMusicLoop,
}: {
  tracks: Record<string, string>;
  nBeatsPerMinute: number;
  nMeasuresInMusicLoop: number;
  children?: (props: { getMusicLoopPosition: () => number }) => React.ReactNode;
}) {
  const trackNames = Object.keys(tracks);

  useEffect(() => {
    const transport = Tone.getTransport();
    const channels: Record<string, Tone.Channel> = {};
    for (const trackName of trackNames) {
      channels[trackName] = new Tone.Channel().toDestination();
    }

    transport.bpm.value = nBeatsPerMinute;
    transport.loop = true;
    transport.loopEnd = `${nMeasuresInMusicLoop}m`;

    const players = new Tone.Players(tracks, () => {
      for (const trackName of trackNames) {
        players.player(trackName).sync().start(0).connect(channels[trackName]);
      }

      transport.start();
    });

    return () => {
      for (const trackName of trackNames) {
        channels[trackName].dispose();
      }
      players.dispose();
      transport.stop();
    };
  }, [tracks, trackNames, nBeatsPerMinute, nMeasuresInMusicLoop]);

  return <>{children}</>;
}

function App() {
  return (
    <ErrorModalBoundary>
      <ToneProvider>
        <AudioLooper
          tracks={{
            drums: "/audio/loops/drums.mp3",
            bass: "/audio/loops/bass.mp3",
            lead: "/audio/loops/lead.mp3",
          }}
          nBeatsPerMinute={82}
          nMeasuresInMusicLoop={8}
        />
        <WebGLCanvas>
          <HaileyDragon />
        </WebGLCanvas>

        <header className="fixed top-0 left-0 w-full text-center z-[--z-ui] text-white font-mono p-4 text-[1.5rem] md:text-[2rem] bg-black/30 leading-none">
          <h1>
            Rainbow Hailey Dragon{" "}
            <span className="text-[1rem]">(in progress)</span>
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 items-center px-4 pt-6 pb-2 text-center max-w-[50rem] w-full m-auto">
            <ControlsTunnel.Out />
          </div>
        </header>

        <div className="absolute bottom-0 right-0 text-[1.5rem] text-white font-mono z-[--z-ui]">
          <a
            href="https://github.com/bryantcodesart/rainbow-hailey-dragon"
            className="block p-4"
            target="_blank"
            rel="noreferrer"
          >
            {"</>"}
          </a>
        </div>
      </ToneProvider>
    </ErrorModalBoundary>
  );
}

export default App;
