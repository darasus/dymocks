import { useQuery } from "@tanstack/react-query";
import { UrlBuilder } from "@dymock/url-builder";

const { url } = new UrlBuilder({
  name: "user",
  type: "single",
  model: {
    firstName: "firstName",
    lastName: "lastName",
    middleName: "middleName",
    gender: "gender",
    jobTitle: "jobTitle",
    jobType: "jobType",
  },
});

export default function Index() {
  const { data } = useQuery(["data"], () =>
    fetch(url).then((res) => res.json())
  );

  return <div>{JSON.stringify(data)}</div>;
}
