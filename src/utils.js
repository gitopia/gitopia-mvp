import axios from "axios"
const appQuery = address => ({
  op: "and",
  expr1: {
    op: "equals",
    expr1: "App-Name",
    expr2: "dgit"
  },
  expr2: {
    op: "equals",
    expr1: "from",
    expr2: address
  }
})

export const txQuery = (address, txType) => ({
  op: "and",
  expr1: appQuery(address),
  expr2: { op: "equals", expr1: "Type", expr2: txType }
})

const api = axios.create({
  baseURL: "https://arweave.net"
})
export const getAllRepositores = async (arweave, address) => {
  try {
    const repos = await api.post("/graphql", {
      query: `query {
        transactions(
          first: 2147483647
          owners: ["${address}"]
          tags: [
            { name: "Type", values: "create-repo" }
            { name: "Version", values: "0.0.2" }
            { name: "App-Name", values: "Gitopia" }
          ]
        ) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }`
    })
    console.log(repos)
    // const tx = await arweave.transactions.get(txid)
    let repoobj = {}
    let objects = repos.data.data.transactions.edges.map(repo => {
      repoobj = {}
      repoobj.txid = repo.node.id
      repoobj.cursor = repo.cursor

      repo.node.tags.forEach(tag => {
        let key = tag.name
        let value = tag.value
        if (key === "Unix-Time") {
          repoobj.unixTime = value
        }
        if (key === "Type") {
          repoobj.type = value
        }
        if (key === "Repo") {
          repoobj.name = value
        }
      })

      console.log(repoobj)
      return repoobj
    })

    // const filteredActivities = objects.filter(activity =>
    //   ["create-repo", "update-ref"].includes(activity.type)
    // )
    // filteredActivities.sort((a, b) => {
    //   return Number(b.unixTime) - Number(a.unixTime)
    // })
    console.log(objects)
    return objects
  } catch (error) {
    console.log(error)
  }
}
export const getAllActivities = async (arweave, address) => {
  try {
    const activities = await api.post("/graphql", {
      query: `query {
        transactions(
          owners: ["${address}"]
          tags: [
            { name: "Type", values: ["create-repo", "update-ref"] }
            { name: "Version", values: "0.0.2" }
            { name: "App-Name", values: "Gitopia" }
          ]
        ) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }`
    })
    console.log(activities)
    // const tx = await arweave.transactions.get(txid)
    let actobj = {}
    let objects = activities.data.data.transactions.edges.map(activity => {
      actobj = {}
      actobj.txid = activity.node.id
      actobj.cursor = activity.cursor

      activity.node.tags.forEach(tag => {
        let key = tag.name
        let value = tag.value
        if (key === "Unix-Time") {
          actobj.unixTime = value
        }
        if (key === "Type") {
          actobj.type = value
        }
        if (key === "Ref") {
          actobj.key = value
        }
        if (key === "Repo") {
          actobj.repoName = value
        }
      })

      if (actobj.type === "create-repo") {
        actobj.value = "Create New Repo"
      }

      console.log(actobj)
      return actobj
    })

    // const filteredActivities = objects.filter(activity =>
    //   ["create-repo", "update-ref"].includes(activity.type)
    // )
    // filteredActivities.sort((a, b) => {
    //   return Number(b.unixTime) - Number(a.unixTime)
    // })
    console.log(objects)
    return objects
  } catch (error) {
    console.log(error)
  }
}

export const getNextActivities = async (arweave, address, cursor, e) => {
  try {
    console.log(cursor)
    const activities = await api.post("/graphql", {
      query: `query {
        transactions(
          first: ${cursor === "next" ? -10 : 10}
          after: "${cursor}"
          owners: ["${address}"]
          tags: [
            { name: "Type", values: ["create-repo", "update-ref"] }
            { name: "Version", values: "0.0.2" }
            { name: "App-Name", values: "Gitopia" }
          ]
        ) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }`
    })
    console.error(activities)
    // const tx = await arweave.transactions.get(txid)
    let actobj = {}
    let objects = activities.data.data.transactions.edges.map(activity => {
      actobj = {}
      actobj.txid = activity.node.id
      actobj.cursor = activity.cursor

      activity.node.tags.forEach(tag => {
        let key = tag.name
        let value = tag.value
        if (key === "Unix-Time") {
          actobj.unixTime = value
        }
        if (key === "Type") {
          actobj.type = value
        }
        if (key === "Ref") {
          actobj.key = value
        }
        if (key === "Repo") {
          actobj.repoName = value
        }
      })

      if (actobj.type === "create-repo") {
        actobj.value = "Create New Repo"
      }

      console.log(actobj)
      return actobj
    })

    // const filteredActivities = objects.filter(activity =>
    //   ["create-repo", "update-ref"].includes(activity.type)
    // )
    // filteredActivities.sort((a, b) => {
    //   return Number(b.unixTime) - Number(a.unixTime)
    // })
    console.log(objects)
    return objects
  } catch (error) {
    console.log(error)
  }
}
