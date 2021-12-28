const fs = require("fs").promises;

(async () => {
  const readCSVFile = await fs.readFile("./testSheet.csv", "UTF-8");
  const split = readCSVFile.split("\n");
  const reduced = split.reduce((total, line) => {
    let [itemName, buyerName, purchaseEmail, purchaseTime, city, country]
    = line.split(",");

    if (itemName === "The DT Vanish (FREE)" || itemName === "Lecture") {
      return total;
    }

    if (itemName === "Homage") {
      itemName = "homage";
    } else if (itemName.indexOf("The HOMAGE Package Deal") > -1) {
      itemName = "homage package deal";
    } else if (itemName === "Modus") {
      itemName = "modus";
    } else if (itemName === "Mythos") {
      itemName = "mythos";
    }

    if (!buyerName) {
      buyerName = "Not Provided";
    }

    if (!city) {
      city = "Not Provided";
    }

    total.push([itemName, buyerName, purchaseEmail, city, country].join(","));
    return total;
  }, []);
  await fs.writeFile("./outputSheet.csv", reduced.join("\n"));
  console.log("done");
})();
