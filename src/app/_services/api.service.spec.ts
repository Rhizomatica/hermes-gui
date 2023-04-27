import { TestBed } from '@angular/core/testing'
import { ApiService } from './api.service'
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http'
import { GlobalConstants } from '../global-constants';
import { Schedule } from '../interfaces/schedule'

describe('ApiService', () => {
  let service: ApiService,
    http: HttpClient,
    originalTimeout,
    schedules: any

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        ApiService
      ]
    })
    service = TestBed.inject(ApiService)
    http = TestBed.inject(HttpClient)
  })

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  //APP GENERALS
  it('should test url server status', () => {
    const spy = spyOn(http, 'get').and.callThrough()
    service.getStatus()
    expect(spy).toHaveBeenCalledWith(`${GlobalConstants.apiURL}/sys/status`);
  })

  it('should return get status server defined', (done: DoneFn) => {
    service.getStatus().subscribe(data => {
      // expect(data).toBe('observable value');
      // expect(data).not.toBe(null);
      expect(data).toBeDefined()
      done()
    })
  })

  it('should test url system configurations server', () => {
    const spy = spyOn(http, 'get').and.callThrough()
    service.getSysConfig()
    expect(spy).toHaveBeenCalledWith(`${GlobalConstants.apiURL}/sys/config`);
  })

  it('should get system configurations server defined', (done: DoneFn) => {
    service.getSysConfig().subscribe(data => {
      expect(data).toBeDefined()
      done()
    })
  })

  //LOGIN NAO USA ******** TODO VERIFICAR
  it('should test url user login', () => {
    const spy = spyOn(http, 'get').and.callThrough()
    const login = 'root'
    const password = 'caduceu'
    service.getLogin(login, password)
    expect(spy).toHaveBeenCalledWith(`${GlobalConstants.apiURL}/login`);
  })

  it('should get system configurations server defined', (done: DoneFn) => {
    const login = 'root'
    const password = 'caduceu'
    service.getLogin(login, password).subscribe(data => {
      expect(data).toBeDefined()
      done()
    })
  })
  //END APP GENERALS

  //LOGS
  it('should get email log defined', (done: DoneFn) => {
    service.getMailLog().subscribe(data => {
      expect(data).toBeDefined()
      done()
    })
  })

  it('should get UUCP log defined', (done: DoneFn) => {
    service.getUucpLog().subscribe(data => {
      expect(data).toBeDefined()
      done()
    })
  })

  it('should get UUCP debug log defined', (done: DoneFn) => {
    service.getUucpDebugLog().subscribe(data => {
      expect(data).toBeDefined()
      done()
    })
  })
  //END LOGS

  //SCHEDULES
  it('should add an schedule and return it', () => {
    const schedule: Schedule = {
      id: 1,
      title: 'Jasmine teste new schedule',
      starttime: '15:30:00',
      stoptime: '16:30:00',
      stations: ['local'],
      enable: true
    };

    service.createSchedule(schedule).subscribe(
      data => expect(data).toBeDefined(),

      //ESTA RETORNANDO OBJETO nao eh tipado
      // {
      //   "id":3,
      //   "title":"Jasmine Teste new schedule",
      //   "starttime":"15:30:00",
      //   "stoptime":"16:30:00",
      //   "stations":["local"],
      //   "enable":true
      // }
      fail
    );
  });

  it('should get schedules defined', (done: DoneFn) => {
    service.getSchedules().subscribe(data => {
      // schedules = data
      // console.log(' MAOI- ' + schedules.title)
      expect(data).toBeDefined()
      done()
    })
  })

  it('should get schedule 1 defined', (done: DoneFn) => {
    service.getSchedule(1).subscribe(data => {
      expect(data).toBeDefined()
      done()
    })
  })

  it('should update schedule 1 and return it', () => {
    const schedule: Schedule = {
      id: 1,
      title: 'Jasmine teste new schedule - UPDATED',
      starttime: '16:30:00',
      stoptime: '17:30:00',
      stations: ['local'],
      enable: true
    };

    service.updateSchedule(1, schedule).subscribe(
      data => expect(data).toBeDefined(),
      fail
    );
  });

  it('should delete schedule id 1 and return it', () => {
    service.deleteSchedule(1).subscribe(
      data => expect(data).toBeDefined(),
      fail
    );
  });
  //END SCHEDULES

  //MACHINE OPTIONS
  it('should restore machine default configurations', () => {
    service.sysRestore().subscribe(
      data => expect(data).toBeDefined(),
      fail
    );
  });

  it('should shutdown machine', () => {
    service.sysShutdown()
  });

  it('should restart machine', () => {
    service.sysReboot()
  });

  //END MACHINE OPTIONS


  //MESSAGE CONFIG 
  it('should update message configuration allow hmp', () => {
    const allowHmp = "true"

    service.setMsgConfig(allowHmp).subscribe(
      data => expect(data).toBeDefined(),
      fail
    );
  });

  it('should update message configuration allow file', () => {
    const allowFile = "true"

    service.setFileConfig(allowFile).subscribe(
      data => expect(data).toBeDefined(),
      fail
    );
  });
  //END MESSAGE CONFIG
});
