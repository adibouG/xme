/////////////////////////////
// JobSource.interface.ts //
///////////////////////////
//
// This file defines the base interfaces for
//   - JobSource_* classes derived from it (e.g. JobSource_LinkedIn.class.ts)
//   - JobOfferList class(es)


/*
 *  IJobList: 
 *    structure of job and job offer listings
 * 
 *  IJobSource: 
 *    structure of a job offer source and methods for searching and retrieving job details
 */

const enum Currency {
    EUR = '\u20ac', //'€',
    USD = '\u0024', //'$',
    GBP = '\u00a3', //'£',
    YEN = '\u00a5', //'¥',
}

enum RateType  {
    Hourly = 'Hourly',
    PerHour = "/h",
    Daily = 'Daily',
    PerDay = "/d",
    Weekly = 'Weekly',
    PerWeek = "/w",
    Monthly = 'Monthly',
    PerMonth = "/m",
    Yearly = 'Yearly',
    PerYear = "/y",
}
 
const enum CategoryTag 
{
    IT = 'IT',
    Engineering = 'Engineering',
    Design = 'Design',
    Marketing = 'Marketing',
    Sales = 'Sales',
    Finance = 'Finance',
    Legal = 'Legal',
    HR = 'HR',
    CustomerService = 'CustomerService',
    Other = 'Other',
} 

interface IJobSalary {
    min: number;
    max: number;
    currency: Currency;
    period: RateType;
}

type KeywordParameters = {
  [key: string]: string;
}

interface IKeywordParameters {
  [key: string]: string;
}


interface IPagination {
    page?: number;
    limit?: number;
    sortBy?: string;
}

interface IJobQuery {
  keywords: IKeywordParameters;
  salary?: IJobSalary;
  location?: string;
  postedSince?: string;
  source?: string | URL;
  pagination?: IPagination;
}

interface IJobList {
  id: string;
  date: Date | string | number;
  searchQuery: IJobQuery;
  totalResultCount?: number;
  retrievedResultCount?: number;
  jobs: IJobDescription[];
}

interface IJobDescription {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    source: string;
    postedDate: string;
    // Add more fields as needed
    salary: IJobSalary | null;
    contractType: string | null;
    contractDuration: string | null;
    jobPoster: string | null;
    category: CategoryTag | string | null;
    type: string | null;
    tags: string[];
  }
  
interface IJobSource {
    source: URL | string;
    
    //postedSince(n: string): string ;   
    search(query: IJobQuery): Promise<IJobList>;
    getJobDetails(id: string): Promise<IJobDescription>; 
  }

export {
  CategoryTag,
  Currency,
  RateType,
  KeywordParameters,
  IKeywordParameters,
  IPagination,
  IJobSalary,
  IJobDescription,
  IJobList,  
  IJobQuery,
  IJobSource
};  