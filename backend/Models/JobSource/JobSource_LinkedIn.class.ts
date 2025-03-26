// src/adapters/LinkedInAdapter.ts
import { 
  IJobList,
  IJobDescription, 
  IJobSource, 
  IJobQuery, 
  IJobSalary,
  CategoryTag
} from "./JobSource.interface";
// src/adapters/LinkedInAdapter.ts
//import type { CategoryTag as tags } from './JobSource.class'  
import { 
  JobList,
  JobDescription, 
  JobSource, 
  JobQuery, 
  JobSalary,
  Pagination,
} from "./JobSource.class";

/***********************************/
 
class LinkedInJobDescription extends JobDescription
{
  constructor() {
    super()
    this.source = "www.linkedin.com" ;
  }
   
}

class LinkedInJobList extends JobList  {
 
}

class LinkedInJob extends JobSource  {
  
  constructor() {
    super()
    this.source = "www.linkedin.com" ;
  }
   
  static dateRangeMap = new Map([
    ["past month",  "r2592000"], // 30*24*3600
    ["past week", "r604800"], // 7*24*3600
    [ "24hr", "r86400"] // 24*3600  
  ]) 


  static makeUrl = function (queryParams: JobQuery) : URL {
           
    let query = `https://${queryParams.source}/jobs-guest/jobs/api/seeMoreJobPostings/search?`;
    const uri = new URL(query);
    const params = uri.searchParams //new URLSearchParams();
    
    if (queryParams.keywords) 
      params.append("keywords", Object.entries(queryParams.keywords).flatMap(e=>e.join('=')).toString())

    if (queryParams.location) 
      params.append("location", queryParams.location);
    
    if (queryParams.postedSince)
      params.append("f_TPR", LinkedInJob.dateRangeMap.get[queryParams.postedSince]);

    if (queryParams.salary)
      params.append("f_SB2", queryParams.salary.min.toString());
      
    params.append("start", queryParams.pagination?.page ? queryParams.pagination?.page?.toString() : "0") //+ this.getPage());
    
    if (queryParams.pagination?.sortBy == Pagination.sort.postedSince.increase) 
      params.append("sortBy", "DD");
    else //if (queryParams.pagination?.sortBy === "relevant")
      params.append("sortBy", "R");

    console.log(uri.toString())
    if (uri.search == params.toString())
      return uri
    return new URL(uri.toString() + params.toString())
  }
  
  static makeHeaders = function () : Headers {
    const h = new Headers();
    h.append("User-Agent", "Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0");
    h.append("Accept", "application/json, text/javascript, */*; q=0.01");
    h.append("Accept-Encoding", "gzip, deflate, br");
    h.append("Referer", "https://www.linkedin.com/jobs");
    h.append("X-Requested-With", "XMLHttpRequest");
    h.append("Connection", "keep-alive");
    h.append("Sec-Fetch-Dest", "empty");
    h.append("Sec-Fetch-Mode", "cors");
    h.append("Sec-Fetch-Site", "same-origin");
    h.append("Cache-Control", "no-cache");
    h.append("Pragma", "no-cache");

    return h;
  }

  
  async search (q: JobQuery): Promise<JobList>
  {
    const url = LinkedInJob.makeUrl(q);
    const head = LinkedInJob.makeHeaders();
    const option = { headers : head } ;
    const req = new Request(url, option);
    const res = await fetch(req)
    const data = await res.json()
    const list = this.normalizeData(data)
    return list;
     /* .catch(error => new Error('LinkedIn search failed')) /*, error))
        JobSourceError*/
      
    }
  
    private normalizeData(data: LinkedInJobList): JobList {
      // Transform LinkedIn specific data to our standard format
      
      data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        source: job.source,
        // ... map other fields
      }));
      return data;
    }

    async getJobDetails(id: string): Promise<LinkedInJobDescription> {
      const j: JobQuery = {
        keywords: {
          job_id: id           
        },
        pagination: {
          limit:1
        },
        source: this.source
      }

      const url = LinkedInJob.makeUrl(j);
      const head = LinkedInJob.makeHeaders();
      const option = { headers : head } ;
      const req = new Request(url, option);
      const res = await fetch(req)
      const data = await res.json()
      return data.jobs.at(0);
    
    }
  }

