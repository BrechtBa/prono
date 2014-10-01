
clear; clc; close all;


dsp = 0;
worldchampion = nan(1000,1);
users = 20;
prono_groep_uitslag_vec     = nan(length(worldchampion),users);
prono_groep_match_vec       = nan(length(worldchampion),users);
prono_groep_winnaar_vec     = nan(length(worldchampion),users);
prono_groep_door_vec        = nan(length(worldchampion),users);
prono_knockout0_vec         = nan(length(worldchampion),users);
prono_knockout1_uitslag_vec = nan(length(worldchampion),users);
prono_knockout2_uitslag_vec = nan(length(worldchampion),users);
prono_knockout3_uitslag_vec = nan(length(worldchampion),users);
prono_knockout4_uitslag_vec = nan(length(worldchampion),users);

tichandle = tic();
for l = 1:length(worldchampion);
    simulatie;
    for m=1:users
        pronostiek;

        worldchampion(l,m) = knockout4.match(1).team(1);
        prono_groep_uitslag_vec(l,m)   = prono_groep_uitslag;
        prono_groep_match_vec(l,m)   = prono_groep_match;
        prono_groep_winnaar_vec(l,m)   = prono_groep_winnaar;
        prono_groep_door_vec(l,m)   = prono_groep_door;
        prono_knockout0_vec(l,m)   = prono_knockout0;
        prono_knockout1_uitslag_vec(l,m)   = prono_knockout1_uitslag;
        prono_knockout2_uitslag_vec(l,m)   = prono_knockout2_uitslag;
        prono_knockout3_uitslag_vec(l,m)   = prono_knockout3_uitslag;
        prono_knockout4_uitslag_vec(l,m)   = prono_knockout4_uitslag;
    end
    
    [~,temp] = sort(prono_groep_uitslag_vec(l,:) + prono_groep_match_vec(l,:) + prono_groep_winnaar_vec(l,:) + prono_groep_door_vec(l,:),'descend');
    winnaar_groepsfase(l) = temp(1);
    [~,temp] = sort(prono_groep_uitslag_vec(l,:) + prono_groep_match_vec(l,:) + prono_groep_winnaar_vec(l,:) + prono_groep_door_vec(l,:) + prono_knockout0_vec(l,:)+ prono_knockout1_uitslag_vec(l,:)+prono_knockout2_uitslag_vec(l,:)+prono_knockout3_uitslag_vec(l,:)+prono_knockout4_uitslag_vec(l,:),'descend');
    winnaar_totaal(l)     = temp(1);
    tweede_totaal(l)      = temp(2);
    derde_totaal(l)       = temp(3);
    
    display_progress(l,length(worldchampion),5,tichandle);
end

figure;
subplot(2,2,1); hist(prono_groep_uitslag_vec); title('uitslag');
subplot(2,2,2); hist(prono_groep_match_vec); title('match');
subplot(2,2,3); hist(prono_groep_winnaar_vec); title('winnaar');
subplot(2,2,4); hist(prono_groep_door_vec); title('door');

disp('gemiddelde punten:')
disp(['groepsfase, uitslagen:' num2str(mean(prono_groep_uitslag_vec(:)))]);
disp(['groepsfase, match:' num2str(mean(prono_groep_match_vec(:))) ]);
disp(['groepsfase, groepswinnaar:' num2str(mean(prono_groep_winnaar_vec(:))) ]);
disp(['groepsfase, naar 2e ronde:' num2str(mean(prono_groep_door_vec(:))) ]);

xcenters = 10:20:300;
figure;
hist(prono_groep_uitslag_vec + prono_groep_match_vec + prono_groep_winnaar_vec + prono_groep_door_vec); title('groepsfase');

disp(['groepsfase, totaal:' num2str(mean(prono_groep_uitslag_vec(:) + prono_groep_match_vec(:) + prono_groep_winnaar_vec(:) + prono_groep_door_vec(:))) ]);



figure;
hist(prono_knockout0_vec); title('knockout op voorhand');

disp(['knockout, op voorhand:' num2str(mean(prono_knockout0_vec(:))) ]);

figure;
subplot(2,2,1); hist(prono_knockout1_uitslag_vec); title('knockout 1');
subplot(2,2,2); hist(prono_knockout2_uitslag_vec); title('knockout 2');
subplot(2,2,3); hist(prono_knockout3_uitslag_vec); title('knockout 3');
subplot(2,2,4); hist(prono_knockout4_uitslag_vec); title('knockout 4');

disp(['knockout fase 1, uitslagen:' num2str(mean(prono_knockout1_uitslag_vec(:)))]);
disp(['knockout fase 2, uitslagen:' num2str(mean(prono_knockout2_uitslag_vec(:)))]);
disp(['knockout fase 3, uitslagen:' num2str(mean(prono_knockout3_uitslag_vec(:)))]);
disp(['knockout fase 4, uitslagen:' num2str(mean(prono_knockout4_uitslag_vec(:)))]);

figure;
hist(prono_knockout1_uitslag_vec+prono_knockout2_uitslag_vec+prono_knockout3_uitslag_vec+prono_knockout4_uitslag_vec); title('knockout totaal');

disp(['knockout, totaal:' num2str(mean(prono_knockout1_uitslag_vec(:)+prono_knockout2_uitslag_vec(:)+prono_knockout3_uitslag_vec(:)+prono_knockout4_uitslag_vec(:)))]);


sum(winnaar_groepsfase==winnaar_totaal)/length(worldchampion)
sum(winnaar_groepsfase==tweede_totaal)/length(worldchampion)
sum(winnaar_groepsfase==derde_totaal)/length(worldchampion)
