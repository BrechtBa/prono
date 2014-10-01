
clear; clc; close all;


dsp = 0;
worldchampion = nan(10000,1);
ranking = nan(length(worldchampion),32);
users = 20;

tichandle = tic();
for l = 1:length(worldchampion);
    simulatie;
    
    % search for which team finisches where
    for m = 1:32
        % look for team m in final
        if m == knockout4.match(1).winner
            ranking(l,m) = 1;
        elseif ~isempty(find(knockout4.match(1).team==m))
            ranking(l,m) = 2;
        elseif m==knockout4.match(2).winner
            ranking(l,m) = 3;
        elseif ~isempty(find(knockout4.match(2).team==m))
            ranking(l,m) = 4;
        elseif ~isempty(find(knockout3.match(1).team==m))
            ranking(l,m) = 5;
        elseif ~isempty(find(knockout3.match(2).team==m))
            ranking(l,m) = 5;
        elseif ~isempty(find(knockout2.match(1).team==m))
            ranking(l,m) = 6;
        elseif ~isempty(find(knockout2.match(2).team==m))
            ranking(l,m) = 6;
        elseif ~isempty(find(knockout2.match(3).team==m))
            ranking(l,m) = 6;
        elseif ~isempty(find(knockout2.match(4).team==m))
            ranking(l,m) = 6;
        elseif ~isempty(find(knockout1.match(1).team==m))
            ranking(l,m) = 9;
        elseif ~isempty(find(knockout1.match(2).team==m))
            ranking(l,m) = 9;
        elseif ~isempty(find(knockout1.match(3).team==m))
            ranking(l,m) = 9;
        elseif ~isempty(find(knockout1.match(4).team==m))
            ranking(l,m) = 9;
        elseif ~isempty(find(knockout1.match(5).team==m))
            ranking(l,m) = 9;
        elseif ~isempty(find(knockout1.match(6).team==m))
            ranking(l,m) = 9;
        elseif ~isempty(find(knockout1.match(7).team==m))
            ranking(l,m) = 9;
        elseif ~isempty(find(knockout1.match(8).team==m))
            ranking(l,m) = 9;
        else
            ranking(l,m) = 17;
        end
    end
    display_progress(l,length(worldchampion),5,tichandle);
end

% histogram of belgian ranking
 hist(ranking(:,12),[1:17])

