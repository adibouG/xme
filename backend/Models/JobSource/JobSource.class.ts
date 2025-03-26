import { IJobList, IJobDescription, IJobSource, IJobQuery, 
    IJobSalary, 
    IPagination, IKeywordParameters,
    KeywordParameters ,
    Currency,
    RateType,
    CategoryTag } from "./JobSource.interface";
  
  /************************************/
  
class Pagination implements IPagination { 
    sortBy?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;

    static sort : {
        postedSince : {
            decrease : 'posted.down',
            increase : 'posted.up',
        },
        salary : {
            decrease : 'salary.down',
            increase : 'salary.up',    
        }
    }

    constructor(){
        this.sortBy = Pagination.sort.postedSince.increase,
        this.limit = -1
        this.page = 1
    }
  
}

abstract class JobSalary implements IJobSalary {
    min: number;
    max: number;
    currency: Currency;
    period: RateType;

    constructor({ max = 0, min = 0, cur = Currency.EUR, rate = RateType.PerMonth }) 
    {
        this.max = Math.max(max, min);
        this.min = Math.min(max, min);
        this.currency = cur;
        this.period = rate;
    }

    calculateAvg () {
        return Math.round(Math.floor((this.max + this.min)/2)) 
    }
}   

abstract class JobQuery implements IJobQuery {
    keywords: IKeywordParameters;
    salary?: JobSalary;
    pagination?: Pagination;
    location?: string;
    postedSince?: string;
    source?: URL | string;
    
   // dateRangeMap: Map<string, string>;

    static dateRangeMap = new Map<string, string>() 
    
    static convertToDateRange(d: string) : string{
        return JobQuery.dateRangeMap[d.toLowerCase()] || "";
    }

   
}

abstract class JobSource implements IJobSource {
    source: URL | string;
    abstract search(query: JobQuery): Promise<JobList> ;// {}
    abstract getJobDetails(id: string): Promise<JobDescription>; // {}
}

abstract class JobDescription implements IJobDescription
{
    static isWithinDateRange(jobDate: string, queryDate: string) {
        let postedSinceQuery = parseInt(JobQuery.convertToDateRange(queryDate).slice(1))
        let postedSinceJob = (Date.now() - Date.parse(jobDate))
        return (postedSinceQuery >= postedSinceJob)
    
    } 

    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    source: string;
    postedDate: string;
    salary: JobSalary | null;
    contractType: string | null;
    jobPoster: string | null;
    contractDuration: string | null;
    category: CategoryTag | string | null;
    type: string | null;
    tags: string[];
    // Add more fields as needed

  }
  
  abstract class JobList implements IJobList 
  {
    id: string;
    date: Date;
    searchQuery: JobQuery;
    totalResultCount?: number;
    retrievedResultCount?: number;
    jobs: JobDescription[];
   }
  
  /**************************************************** */
  
  export { 
    JobDescription,
    JobList,
    JobQuery,
    JobSalary,
    JobSource,
    Currency,
    Pagination
  }