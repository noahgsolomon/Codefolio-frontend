const deploy = async () => {
  try {
    const response = await fetch("https://f60z27ge89.execute-api.us-east-1.amazonaws.com/prod/deploy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("Id")
      },
    });

    const responseJson = await response.json();
    console.log(responseJson)
    if (responseJson.status === "OK") {
      return responseJson;
    } else {
      console.log(responseJson.message);
      return responseJson;
    }
  } catch (e) {
    console.log(e);
  }
};

export { deploy };
