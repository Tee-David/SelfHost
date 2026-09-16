import path from "node:path";
import type { SelfHostConfig } from "../config";
import { runCommand, type CommandResult } from "../command-runner";
import { assertAccountName, assertDatabaseName, assertDnsPriority, assertDnsRecordName, assertDnsType, assertDnsValue, assertDomain, assertHestiaUser, assertPassword, assertRecordId } from "./validation";
import { decimal, integer, yes, type Backup, type CronJob, type Database, type DnsRecord, type DnsZone, type FirewallRule, type HestiaRecordMap, type MailAccount, type MailDomain, type Service, type WebDomain } from "./types";
const SUDO = "/usr/bin/sudo";
const ALLOWED_COMMANDS = new Set([
  "v-list-web-domains","v-list-databases","v-list-mail-domains","v-list-mail-accounts","v-list-dns-domains","v-list-dns-records","v-list-user-backups","v-list-cron-jobs","v-list-sys-services","v-list-firewall",
  "v-add-web-domain","v-delete-web-domain","v-add-letsencrypt-domain","v-add-web-domain-ssl-force","v-delete-web-domain-ssl-force","v-suspend-web-domain","v-unsuspend-web-domain",
  "v-add-database","v-delete-database","v-add-mail-domain","v-add-mail-account","v-delete-mail-account","v-add-dns-domain","v-delete-dns-domain","v-add-dns-record","v-delete-dns-record","v-backup-user","v-delete-user-backup"
]);
export class HestiaResponseError extends Error { constructor(message="Hestia returned an invalid response"){ super(message); this.name="HestiaResponseError"; } }
function parseJsonObject(stdout:string):HestiaRecordMap { try { const value:unknown=JSON.parse(stdout); if(!value||typeof value!=="object"||Array.isArray(value)) throw new HestiaResponseError(); for(const record of Object.values(value as Record<string,unknown>)){ if(!record||typeof record!=="object"||Array.isArray(record)) throw new HestiaResponseError(); } return value as HestiaRecordMap; } catch(error){ if(error instanceof HestiaResponseError) throw error; throw new HestiaResponseError(); } }
export class HestiaClient {
  constructor(private readonly config:SelfHostConfig){}
  private async execute(command:string,args:readonly string[],timeoutMs?:number):Promise<CommandResult>{ if(!ALLOWED_COMMANDS.has(command)) throw new Error("Hestia command is not allowlisted"); const executable=path.posix.join(this.config.hestia.binDir,command); return runCommand({executable:SUDO,args:["-n",executable,...args],...(timeoutMs?{timeoutMs}:{})}); }
  private async list(command:string,args:readonly string[]=[]):Promise<HestiaRecordMap>{ return parseJsonObject((await this.execute(command,[...args,"json"])).stdout); }
  async listWebDomains(user=this.config.hestia.user):Promise<WebDomain[]>{ const data=await this.list("v-list-web-domains",[assertHestiaUser(user)]); return Object.entries(data).map(([domain,d])=>({domain,ip:d.IP??"",ssl:yes(d.SSL),letsEncrypt:yes(d.LETSENCRYPT),suspended:yes(d.SUSPENDED),aliases:(d.ALIAS??"").split(",").map(v=>v.trim()).filter(Boolean),bandwidthMb:integer(d.U_BANDWIDTH),diskMb:integer(d.U_DISK)})); }
  async listDatabases(user=this.config.hestia.user):Promise<Database[]>{ const data=await this.list("v-list-databases",[assertHestiaUser(user)]); return Object.entries(data).map(([name,d])=>({name,type:d.TYPE??"",user:d.DBUSER??"",sizeMb:integer(d.U_DISK),host:d.HOST??"localhost"})); }
  async listMailDomains(user=this.config.hestia.user):Promise<MailDomain[]>{ const data=await this.list("v-list-mail-domains",[assertHestiaUser(user)]); return Object.entries(data).map(([domain,d])=>({domain,accounts:integer(d.ACCOUNTS),dkim:yes(d.DKIM),antispam:yes(d.ANTISPAM),antivirus:yes(d.ANTIVIRUS)})); }
  async listMailAccounts(domain:string,user=this.config.hestia.user):Promise<MailAccount[]>{ domain=assertDomain(domain); const data=await this.list("v-list-mail-accounts",[assertHestiaUser(user),domain]); return Object.entries(data).map(([account,d])=>({account,domain,quotaMb:integer(d.QUOTA),usedMb:integer(d.U_DISK),forward:d.FWD??"",suspended:yes(d.SUSPENDED)})); }
  async listDnsZones(user=this.config.hestia.user):Promise<DnsZone[]>{ const data=await this.list("v-list-dns-domains",[assertHestiaUser(user)]); return Object.entries(data).map(([domain,d])=>({domain,ip:d.IP??"",records:integer(d.RECORDS),ns1:d.NS1??"",ns2:d.NS2??""})); }
  async listDnsRecords(domain:string,user=this.config.hestia.user):Promise<DnsRecord[]>{ domain=assertDomain(domain); const data=await this.list("v-list-dns-records",[assertHestiaUser(user),domain]); return Object.entries(data).map(([id,d])=>({id,domain,record:d.RECORD??"",type:d.TYPE??"",value:d.VALUE??"",priority:d.PRIORITY??""})); }
  async listBackups(user=this.config.hestia.user):Promise<Backup[]>{ const data=await this.list("v-list-user-backups",[assertHestiaUser(user)]); return Object.entries(data).map(([id,d])=>({id,sizeMb:integer(d.SIZE),web:d.WEB??"",db:d.DB??"",mail:d.MAIL??"",date:d.DATE??"",time:d.TIME??""})); }
  async listCronJobs(user=this.config.hestia.user):Promise<CronJob[]>{ const data=await this.list("v-list-cron-jobs",[assertHestiaUser(user)]); return Object.entries(data).map(([id,d])=>({id,min:d.MIN??"*",hour:d.HOUR??"*",day:d.DAY??"*",month:d.MONTH??"*",wday:d.WDAY??"*",command:d.CMD??""})); }
  async listServices():Promise<Service[]>{ const data=await this.list("v-list-sys-services"); return Object.entries(data).map(([name,d])=>({name,system:d.SYSTEM??"",state:d.STATE??"",cpu:decimal(d.CPU),mem:decimal(d.MEM)})); }
  async listFirewallRules():Promise<FirewallRule[]>{ const data=await this.list("v-list-firewall"); return Object.entries(data).map(([id,d])=>({id,action:d.ACTION??"",protocol:d.PROTOCOL??"",port:d.PORT??"",ip:d.IP??"",comment:d.COMMENT??""})); }
  async addWebDomain(domain:string,user=this.config.hestia.user){ await this.execute("v-add-web-domain",[assertHestiaUser(user),assertDomain(domain)]); }
  async deleteWebDomain(domain:string,user=this.config.hestia.user){ await this.execute("v-delete-web-domain",[assertHestiaUser(user),assertDomain(domain)]); }
  async issueLetsEncrypt(domain:string,user=this.config.hestia.user){ await this.execute("v-add-letsencrypt-domain",[assertHestiaUser(user),assertDomain(domain)],120_000); }
  async setSslForce(domain:string,enabled:boolean,user=this.config.hestia.user){ await this.execute(enabled?"v-add-web-domain-ssl-force":"v-delete-web-domain-ssl-force",[assertHestiaUser(user),assertDomain(domain),"yes"]); }
  async setWebDomainSuspended(domain:string,suspended:boolean,user=this.config.hestia.user){ await this.execute(suspended?"v-suspend-web-domain":"v-unsuspend-web-domain",[assertHestiaUser(user),assertDomain(domain),"yes"]); }
  async addDatabase(name:string,dbUser:string,password:string,type:"mysql"|"pgsql"="mysql",user=this.config.hestia.user){ await this.execute("v-add-database",[assertHestiaUser(user),assertDatabaseName(name),assertDatabaseName(dbUser),assertPassword(password),type]); }
  async deleteDatabase(name:string,user=this.config.hestia.user){ await this.execute("v-delete-database",[assertHestiaUser(user),assertDatabaseName(name)]); }
  async addMailDomain(domain:string,user=this.config.hestia.user){ await this.execute("v-add-mail-domain",[assertHestiaUser(user),assertDomain(domain),"yes","yes","yes"]); }
  async addMailAccount(domain:string,account:string,password:string,user=this.config.hestia.user){ await this.execute("v-add-mail-account",[assertHestiaUser(user),assertDomain(domain),assertAccountName(account),assertPassword(password)]); }
  async deleteMailAccount(domain:string,account:string,user=this.config.hestia.user){ await this.execute("v-delete-mail-account",[assertHestiaUser(user),assertDomain(domain),assertAccountName(account)]); }
  async addDnsZone(domain:string,ip:string,user=this.config.hestia.user){ await this.execute("v-add-dns-domain",[assertHestiaUser(user),assertDomain(domain),assertDnsValue(ip)]); }
  async deleteDnsZone(domain:string,user=this.config.hestia.user){ await this.execute("v-delete-dns-domain",[assertHestiaUser(user),assertDomain(domain)]); }
  async addDnsRecord(domain:string,record:string,type:string,value:string,priority="0",user=this.config.hestia.user){ await this.execute("v-add-dns-record",[assertHestiaUser(user),assertDomain(domain),assertDnsRecordName(record),assertDnsType(type),assertDnsValue(value),assertDnsPriority(priority)]); }
  async deleteDnsRecord(domain:string,id:string,user=this.config.hestia.user){ await this.execute("v-delete-dns-record",[assertHestiaUser(user),assertDomain(domain),assertRecordId(id)]); }
  async createBackup(user=this.config.hestia.user){ await this.execute("v-backup-user",[assertHestiaUser(user)],120_000); }
  async deleteBackup(id:string,user=this.config.hestia.user){ if(!/^[a-zA-Z0-9._-]{1,128}$/.test(id)) throw new Error("Invalid backup id"); await this.execute("v-delete-user-backup",[assertHestiaUser(user),id]); }
}
