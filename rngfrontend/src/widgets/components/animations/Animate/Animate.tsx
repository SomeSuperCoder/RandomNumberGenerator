/* By github.com/SomeSuperCoder */

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { type JSX } from "react";
const hashesDuration = 2;
const splitDuration = 2;
const pickDuration = 4;
const convertDuration = 2;
const sumDuration = 2;

const margin = 40;
const fontSizeNumber = 1.5;
const fontSize = `${fontSizeNumber}rem`;

enum AnimationStep {
  Hashes,
  Split,
  Pick,
  Convert,
  Sum,
}

// ✨ добавили необязательный className для внешней обёртки
export default function Animate(props: {
  hashes: string[];
  split: string[][];
  pick: string[];
  convert: number[];
  sum: number;
  result: number;
  xFactor: number;
  className?: string;
}) {
  const time = useMemo(() => {
    const millisecondTimestamp = props.xFactor / 1_000_000;
    return new Date(millisecondTimestamp);
  }, [props.xFactor]);

  const [step, setStep] = useState<AnimationStep | null>(AnimationStep.Hashes);

  let content: JSX.Element | null = null;
  switch (step) {
    case AnimationStep.Hashes:
      setTimeout(() => setStep(AnimationStep.Split), hashesDuration * 1000);
      content = <Hashes hashes={props.hashes} />;
      break;
    case AnimationStep.Split:
      setTimeout(() => setStep(AnimationStep.Pick), splitDuration * 1000);
      content = <Split split={props.split} />;
      break;
    case AnimationStep.Pick:
      setTimeout(() => setStep(AnimationStep.Convert), pickDuration * 1000);
      content = <Pick split={props.split} pick={props.pick} time={time} />;
      break;
    case AnimationStep.Convert:
      setTimeout(() => setStep(AnimationStep.Sum), convertDuration * 1000);
      content = (
        <Convert
          split={props.split}
          pick={props.pick}
          convert={props.convert}
          time={time}
        />
      );
      break;
    case AnimationStep.Sum:
      content = (
        <Sum
          split={props.split}
          pick={props.pick}
          convert={props.convert}
          sum={props.sum}
          result={props.result}
          time={time}
        />
      );
      break;
    default:
      content = null;
  }

  // 🌟 внешняя обёртка: белый текст + центровка
  return (
    <div
      className={`text-white w-full py-6 flex flex-col items-center justify-start ${
        props.className ?? ""
      }`}
    >
      <div className="w-full max-w-3xl text-center">{content}</div>
    </div>
  );
}

function Hashes(props: { hashes: string[] }) {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {props.hashes.map((hash, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, fontSize }}
          animate={{ opacity: 1 }}
          transition={{ duration: hashesDuration }}
        >
          {hash}
        </motion.p>
      ))}
    </div>
  );
}

function Split(props: { split: string[][] }) {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {props.split.map((combo, i) => (
        <motion.div className="flex justify-center items-center" key={i}>
          {combo.map((value, j) => (
            <motion.p
              initial={{ marginRight: 0, fontSize }}
              animate={{ marginRight: margin }}
              transition={{ duration: splitDuration }}
              key={j}
            >
              {value}
            </motion.p>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function Pick(props: { split: string[][]; pick: string[]; time: Date }) {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <motion.p
        initial={{ fontSize: 0 }}
        animate={{ fontSize: "2rem" }}
        transition={{ duration: pickDuration / 2 }}
      >
        На основе {props.time.toLocaleString("ru-RU")}
      </motion.p>
      {props.split.map((combo, i) => (
        <motion.div className="flex justify-center items-center" key={i}>
          {combo.map((value, j) => (
            <motion.p
              initial={{ marginRight: 40, opacity: 1, fontSize }}
              animate={{ opacity: props.pick.includes(value) ? 1 : 0 }}
              transition={{ duration: pickDuration }}
              key={j}
            >
              {value}
            </motion.p>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function Convert(props: {
  split: string[][];
  pick: string[];
  convert: number[];
  time: Date;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <motion.p
        initial={{ fontSize: "2rem" }}
        animate={{ fontSize: 0 }}
        transition={{ duration: convertDuration / 2 }}
      >
        На основе {props.time.toLocaleString("ru-RU")}
      </motion.p>
      {props.split.map((combo, i) => (
        <motion.div className="flex justify-center items-center" key={i}>
          {combo.map((value, j) => (
            <div className="relative" key={j}>
              {/* Hex */}
              <motion.p
                initial={{
                  marginRight: 40,
                  opacity: props.pick.includes(value) ? 1 : 0,
                  fontSize,
                }}
                animate={{ opacity: 0 }}
                transition={{ duration: convertDuration }}
              >
                {value}
              </motion.p>
              {/* Decimal */}
              <motion.p
                initial={{
                  marginRight: 40,
                  opacity: 0,
                  position: "absolute",
                  top: 0,
                  fontSize,
                }}
                animate={{ opacity: props.pick.includes(value) ? 1 : 0 }}
                transition={{ duration: convertDuration }}
              >
                {props.convert[props.pick.indexOf(value)]}
              </motion.p>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function Sum(props: {
  split: string[][];
  pick: string[];
  convert: number[];
  sum: number;
  result: number;
  time: Date;
}) {
  return (
    <div className="relative flex flex-col justify-center items-center gap-5">
      {/* Sum */}
      <motion.p
        initial={{ fontSize: 0, opacity: 0 }}
        animate={{ opacity: 1, fontSize }}
        transition={{ duration: sumDuration * 2 }}
      >
        {props.sum} % 1001 / 1000
      </motion.p>
      {/* Result */}
      <motion.p
        initial={{ fontSize: 0, opacity: 0 }}
        animate={{ opacity: [0, 1], fontSize: [0, "3rem"] }}
        transition={{ duration: sumDuration * 2, times: [1, 1] }}
      >
        {props.result}
      </motion.p>

      {/* скрываем исходные блоки */}
      {props.split.map((combo, i) => (
        <motion.div
          className="flex justify-center items-center"
          key={i}
          animate={{ display: "none" }}
          transition={{ duration: sumDuration }}
        >
          {combo.map((value, j) =>
            props.pick.includes(value) ? (
              <motion.div
                className="relative"
                key={j}
                animate={{ opacity: 0 }}
                transition={{ duration: sumDuration }}
              >
                <motion.p initial={{ marginRight: 40, opacity: 0, fontSize }}>
                  {value}
                </motion.p>
                <motion.p
                  initial={{
                    marginRight: 40,
                    opacity: props.pick.includes(value) ? 1 : 0,
                    position: "absolute",
                    top: 0,
                    fontSize,
                  }}
                >
                  {props.convert[props.pick.indexOf(value)]}
                </motion.p>
              </motion.div>
            ) : null
          )}
        </motion.div>
      ))}
    </div>
  );
}
