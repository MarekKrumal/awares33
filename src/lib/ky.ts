import ky from "ky"; //https://github.com/sindresorhus/ky

const kdyInstance = ky.create({
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    }),
});

export default kdyInstance;
