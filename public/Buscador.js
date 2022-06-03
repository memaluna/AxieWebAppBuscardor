fetch("https://graphql-gateway.axieinfinity.com/graphql?", {
  method: "POST",
  body: JSON.stringify({
    operationName: "GetAxieBriefList",
    variables: {
      from: 0,
      size: 10,
      sort: "PriceAsc",
      auctionType: "Sale",
      criteria: {
        classes: ["Aquatic"],
        parts: [
          "mouth-risky-fish",
          "horn-shoal-star",
          "horn-5h04l-5t4r",
          "back-goldfish",
          "tail-koi",
          "tail-kuro-koi",
          "tail-koinobori",
        ],
        hp: null,
        speed: 57,
        skill: null,
        morale: null,
        breedCount: null,
        pureness: [6],
        numMystic: [],
        title: null,
        region: null,
        stages: [3, 4],
      },
    },
    query:
      "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n",
  }),
  headers: {
    "content-type": "application/json",
  },
  credentials: "same-origin",
})
  .then(function (response) {
    return response.json().then((data) => {
      console.log(data.data.axies.results[0]);
    });
  })
  .catch(function (e) {
    console.error(e);
  });
