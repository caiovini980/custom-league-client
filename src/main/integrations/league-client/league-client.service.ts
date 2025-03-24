import { ServiceAbstract } from "@main/abstract/service.abstract";
import { Service } from "@main/decorators/service.decorator";
import { OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { authenticate, Credentials, LeagueClient, createHttp1Request, HttpRequestOptions } from 'league-connect'
import { method } from "lodash";

@Service()
export class LeagueClientService extends ServiceAbstract implements OnApplicationBootstrap, OnApplicationShutdown {
    private newCredentials: Credentials
    private client: LeagueClient
    private isConnected: boolean

    async onApplicationBootstrap() {
        this.logger.info("Initiating League Client Service...")

        const credentials = await authenticate()
        const client = new LeagueClient(credentials)
        
        this.newCredentials = credentials
        this.client = client
        
        this.setupConnection()
        this.client.start()
    }

    onApplicationShutdown(signal?: string) {
        this.logger.info("Stopping League Client Service...")
        this.client.stop()
    }

    setupConnection(): void {
        this.client.on('connect', (newCredentials) => { 
            this.logger.info("[League Client Service] Client instance connected.")
            this.newCredentials = newCredentials
            this.isConnected = true
            this.sendMsgToRender('isClientConnected', true)
        })
          
        this.client.on('disconnect', () => {
            this.logger.info("[League Client Service] Client instance disconnected.")
            this.isConnected = false
            this.sendMsgToRender('isClientConnected', false)
        })
    }

    async handleEndpoint(method: HttpRequestOptions["method"], url: string, body: unknown) {
        const response = await createHttp1Request({
            method: method,
            url: url,
            body: body
        }, this.newCredentials)

        return response
    }
}