const getIngrediensData = async () => {
  return await fetch(`/20_5.json`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((res) => res.json());
};

export default getIngrediensData;
