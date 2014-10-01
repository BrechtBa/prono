
% WK_simulatie
%clear; clc; close all; dsp = 1;

%            1       2         3          4          5         6           7        8             9       10       11        12        13    14      15            16       17       18       19        20             21       22        23        24         25           26     27      28        29      30         31               32
team      = {'Spain','Germany','Portugal','Colombia','Uruguay','Argentina','Brazil','Switzerland','Italy','Greece','England','Belgium','USA','Chile','Netherlands','France','Russia','Mexico','Croatia','Cote d ivore','Bosnia','Algeria','Ecuador','Honduras','Costa Rica','Iran','Ghana','Nigeria','Japan','Cameroon','Korea Republic','Australia'};
fifa_pts  = [ 1460  ,1340     ,1186      ,1181      ,1174     ,1174       ,1161    ,1115         ,1082   ,1043    ,1039     ,1015     ,1011 ,967    ,935          ,913     ,876     ,871     ,871      ,830           ,795     ,795      ,790      ,754       ,744         ,715   ,713    ,620      ,613    ,583       ,551             ,545];
goalchance = max(1,fifa_pts.^2/max(fifa_pts.^2)*5);





group(1).teams = [ 7 19 18 30];
group(2).teams = [ 1 15 14 32];
group(3).teams = [ 4 10 20 29];
group(4).teams = [ 5 25 11  9];
group(5).teams = [ 8 23 16 24];
group(6).teams = [ 6 21 26 28];
group(7).teams = [ 2  3 27 13];
group(8).teams = [12 22 17 31];


% groepsfase definitie
for i = 1:length(group)
    group(i).points = [0 0 0 0];
    group(i).goals_scored= [0 0 0 0];
    group(i).goals_taken = [0 0 0 0];
    
    group(i).match(1).team(1) = group(i).teams(1);
    group(i).match(1).team(2) = group(i).teams(2);

    group(i).match(2).team(1) = group(i).teams(3);
    group(i).match(2).team(2) = group(i).teams(4);

    group(i).match(3).team(1) = group(i).teams(1);
    group(i).match(3).team(2) = group(i).teams(3);

    group(i).match(4).team(1) = group(i).teams(4);
    group(i).match(4).team(2) = group(i).teams(2);

    group(i).match(5).team(1) = group(i).teams(4);
    group(i).match(5).team(2) = group(i).teams(1);

    group(i).match(6).team(1) = group(i).teams(2);
    group(i).match(6).team(2) = group(i).teams(3);
end


%% simulatie
% groepsfase
for i = 1:length(group)
    for j = 1:length(group(i).match)
        
        group(i).match(j).score(1) = round( rand()*goalchance(group(i).match(j).team(1)) );
        group(i).match(j).score(2) = round( rand()*goalchance(group(i).match(j).team(2)) );
        
        ind1 = find(group(i).teams==group(i).match(j).team(1));
        ind2 = find(group(i).teams==group(i).match(j).team(2));
        
        group(i).goals_scored(ind1) = group(i).goals_scored(ind1) + group(i).match(j).score(1);
        group(i).goals_scored(ind2) = group(i).goals_scored(ind2) + group(i).match(j).score(2);
        
        group(i).goals_taken(ind1) = group(i).goals_taken(ind1) + group(i).match(j).score(2);
        group(i).goals_taken(ind2) = group(i).goals_taken(ind2) + group(i).match(j).score(1);
        
        if group(i).match(j).score(1) > group(i).match(j).score(2);
            group(i).points(ind1) = group(i).points(ind1) + 3;
            group(i).points(ind2) = group(i).points(ind2) + 0;
        elseif group(i).match(j).score(1) < group(i).match(j).score(2);
            group(i).points(ind1) = group(i).points(ind1) + 0;
            group(i).points(ind2) = group(i).points(ind2) + 3;
        else
            group(i).points(ind1) = group(i).points(ind1) + 1;
            group(i).points(ind2) = group(i).points(ind2) + 1;
        end
        
    end
end

% punten telling
for i = 1:length(group)
    points = group(i).points*100 + (group(i).goals_scored-group(i).goals_taken)*10 + group(i).goals_scored*1;
    
    % when an equal number of points is still present this is disregarded
    [~,ind] = sort( points ,'descend');
    
    group(i).ranking = ind;
end


% matchen in groepsfase weergeven
if dsp
    for i = 1:length(group)
        for j = 1:length(group(i).match)
            
        spaces1 = repmat(' ',1,30-length([ team{ group(i).match(j).team(1) }  '  -  ' team{ group(i).match(j).team(2) } ]));
        disp([ team{ group(i).match(j).team(1) }  '  -  ' team{ group(i).match(j).team(2) }   spaces1 ': '   num2str(group(i).match(j).score(1)) ' - ' num2str(group(i).match(j).score(2)) ]);
        end
        disp(' ');
    end
    disp(' ');
    disp(' ');
end

% punten in groepsfase weergeven:
if dsp
    for i = 1:length(group)
        disp(['Groep ' char(i+64)]);
        ind = group(i).ranking;

        for j = 1:length(ind)
            spaces1 = repmat(' ',1,15-length(team{group(i).teams(ind(j))}));
            spaces2 = repmat(' ',1,25-length([team{group(i).teams(ind(j))} spaces1 ': '  num2str(group(i).points(ind(j)))]));

            disp([team{group(i).teams(ind(j))} spaces1 ': '  num2str(group(i).points(ind(j)))   spaces2  '+' num2str(group(i).goals_scored(ind(j))) '   -' num2str(group(i).goals_taken(ind(j)))]);
        end
        disp(' ');
        disp(' ');
    end
end

% 8e finales
for i = 1:length(group)/2
    knockout1.match(2*i-1).team(1) = group(2*i-1).teams(group(2*i-1).ranking(1));
    knockout1.match(2*i-1).team(2) = group(2*i-0).teams(group(2*i-0).ranking(2));
    
    knockout1.match(2*i-0).team(1) = group(2*i-1).teams(group(2*i-1).ranking(2));
    knockout1.match(2*i-0).team(2) = group(2*i-0).teams(group(2*i-0).ranking(1));   
end


for i = 1:length(knockout1.match)
    knockout1.match(i).score(1) = round( rand()*goalchance(knockout1.match(i).team(1)) );
    knockout1.match(i).score(2) = round( rand()*goalchance(knockout1.match(i).team(2)) );
    
    if knockout1.match(i).score(1) > knockout1.match(i).score(2)
        knockout1.match(i).winner = knockout1.match(i).team(1);
    elseif knockout1.match(i).score(1) < knockout1.match(i).score(2)
         knockout1.match(i).winner = knockout1.match(i).team(2);
    else
        if  round(rand())
            knockout1.match(i).winner = knockout1.match(i).team(1);
        else
            knockout1.match(i).winner = knockout1.match(i).team(2);
        end
    end
end
if dsp
    disp('8e finales:');
    for i = 1:length(knockout1.match)
        spaces1 = repmat(' ',1,30-length([ team{ knockout1.match(i).team(1) }  '  -  ' team{ knockout1.match(i).team(2) } ]));
        disp([ team{ knockout1.match(i).team(1) }  '  -  ' team{ knockout1.match(i).team(2) }   spaces1 ': '   num2str(knockout1.match(i).score(1)) ' - ' num2str(knockout1.match(i).score(2)) ]);
    end
disp(' ');
disp(' ');
end


% 4e finales
for i = 1:length(group)/4
    knockout2.match(2*i-1).team(1) = knockout1.match(4*i-3).winner;
    knockout2.match(2*i-1).team(2) = knockout1.match(4*i-1).winner;
        
    knockout2.match(2*i-0).team(1) = knockout1.match(4*i-2).winner;
    knockout2.match(2*i-0).team(2) = knockout1.match(4*i-0).winner;
end


for i = 1:length(knockout2.match)
    knockout2.match(i).score(1) = round( rand()*goalchance(knockout2.match(i).team(1)) );
    knockout2.match(i).score(2) = round( rand()*goalchance(knockout2.match(i).team(2)) );
    
    if knockout2.match(i).score(1) > knockout2.match(i).score(2)
        knockout2.match(i).winner = knockout2.match(i).team(1);
    elseif knockout2.match(i).score(1) < knockout2.match(i).score(2)
         knockout2.match(i).winner = knockout2.match(i).team(2);
    else
        if  round(rand())
            knockout2.match(i).winner = knockout2.match(i).team(1);
        else
            knockout2.match(i).winner = knockout2.match(i).team(2);
        end
    end
     
end
if dsp
    disp('4e finales:');
    for i = 1:length(knockout2.match)
        spaces1 = repmat(' ',1,30-length([ team{ knockout2.match(i).team(1) }  '  -  ' team{ knockout2.match(i).team(2) } ]));
        disp([ team{ knockout2.match(i).team(1) }  '  -  ' team{ knockout2.match(i).team(2) }   spaces1 ': '   num2str(knockout2.match(i).score(1)) ' - ' num2str(knockout2.match(i).score(2)) ]);
    end
    disp(' ');
    disp(' ');
end

% 2e finales
knockout3.match(1).team(1) = knockout2.match(1).winner;
knockout3.match(1).team(2) = knockout2.match(3).winner;

knockout3.match(2).team(1) = knockout2.match(2).winner;
knockout3.match(2).team(2) = knockout2.match(4).winner;

for i = 1:length(knockout3.match)
    knockout3.match(i).score(1) = round( rand()*goalchance(knockout3.match(i).team(1)) );
    knockout3.match(i).score(2) = round( rand()*goalchance(knockout3.match(i).team(2)) );
    
    if knockout3.match(i).score(1) > knockout3.match(i).score(2)
        knockout3.match(i).winner = knockout3.match(i).team(1);
    elseif knockout3.match(i).score(1) < knockout3.match(i).score(2)
         knockout3.match(i).winner = knockout3.match(i).team(2);
    else
        if  round(rand())
            knockout3.match(i).winner = knockout3.match(i).team(1);
        else
            knockout3.match(i).winner = knockout3.match(i).team(2);
        end
    end

end
if dsp
    disp('2e finales:');
    for i = 1:length(knockout3.match)
        spaces1 = repmat(' ',1,30-length([ team{ knockout3.match(i).team(1) }  '  -  ' team{ knockout3.match(i).team(2) } ]));
        disp([ team{ knockout3.match(i).team(1) }  '  -  ' team{ knockout3.match(i).team(2) }   spaces1 ': '   num2str(knockout3.match(i).score(1)) ' - ' num2str(knockout3.match(i).score(2)) ]);
    end
    disp(' ');
    disp(' ');
end


% finale
knockout4.match(1).team(1) = knockout3.match(1).winner;
knockout4.match(1).team(2) = knockout3.match(2).winner;

knockout4.match(2).team(1) = knockout3.match(1).team(knockout3.match(1).team~=knockout3.match(1).winner);
knockout4.match(2).team(2) = knockout3.match(2).team(knockout3.match(2).team~=knockout3.match(2).winner);

for i = 1:length(knockout4.match)
    knockout4.match(i).score(1) = round( rand()*goalchance(knockout4.match(i).team(1)) );
    knockout4.match(i).score(2) = round( rand()*goalchance(knockout4.match(i).team(2)) );
    
    if knockout4.match(i).score(1) > knockout4.match(i).score(2)
        knockout4.match(i).winner = knockout4.match(i).team(1);
    elseif knockout4.match(i).score(1) < knockout4.match(i).score(2)
         knockout4.match(i).winner = knockout4.match(i).team(2);
    else
        if  round(rand())
            knockout4.match(i).winner = knockout4.match(i).team(1);
        else
            knockout4.match(i).winner = knockout4.match(i).team(2);
        end
    end 
end
if dsp
    disp('finale:');
    for i = 1:length(knockout4.match)
        spaces1 = repmat(' ',1,30-length([ team{ knockout4.match(i).team(1) }  '  -  ' team{ knockout4.match(i).team(2) } ]));
        disp([ team{ knockout4.match(i).team(1) }  '  -  ' team{ knockout4.match(i).team(2) }   spaces1 ': '   num2str(knockout4.match(i).score(1)) ' - ' num2str(knockout4.match(i).score(2)) ]);
    end
    disp(' ');
    disp(' ');
end

if dsp
    disp(['World Champion: ' team{ knockout4.match(1).winner }]);
end