
prono_groep_uitslag = 0;
prono_groep_match = 0;
prono_groep_door = 0;
prono_groep_winnaar = 0;
prono_knockout0 = 0;
prono_knockout1_uitslag = 0;
prono_knockout2_uitslag = 0;
prono_knockout3_uitslag = 0;
prono_knockout4_uitslag = 0;


% voor de start van het WK
for i = 1:length(group)
    for j = 1:length(group(i).match)
        
        % groepsfase pronostiek
        group(i).match(j).prono(1) = round( rand()*goalchance(group(i).match(j).team(1)) );
        group(i).match(j).prono(2) = round( rand()*goalchance(group(i).match(j).team(2)) );
        
        % pronostiek punten
        if group(i).match(j).score(1) == group(i).match(j).prono(1) && group(i).match(j).score(2) == group(i).match(j).prono(2)
            prono_groep_uitslag = prono_groep_uitslag + 7;
        elseif sign(group(i).match(j).score(1) - group(i).match(j).score(2) ) == sign(group(i).match(j).prono(1) - group(i).match(j).prono(2) )
            prono_groep_match = prono_groep_match + 3;
        end
    end
end

% knockout fase benoeming door simulatie met de favorieten
%%
% 8e finales
for i = 1:length(group)/2
    knockout1_prono.match(2*i-1).team(1) = group(2*i-1).teams(1);
    knockout1_prono.match(2*i-1).team(2) = group(2*i-0).teams(2);
    
    knockout1_prono.match(2*i-0).team(1) = group(2*i-1).teams(2);
    knockout1_prono.match(2*i-0).team(2) = group(2*i-0).teams(1);   
end
for i = 1:length(knockout1_prono.match)
    knockout1_prono.match(i).score(1) = round( rand()*goalchance(knockout1_prono.match(i).team(1)) );
    knockout1_prono.match(i).score(2) = round( rand()*goalchance(knockout1_prono.match(i).team(2)) );
    
    if knockout1_prono.match(i).score(1) > knockout1_prono.match(i).score(2)
        knockout1.match(i).winner_prono = knockout1_prono.match(i).team(1);
    elseif knockout1_prono.match(i).score(1) < knockout1_prono.match(i).score(2)
         knockout1.match(i).winner_prono = knockout1_prono.match(i).team(2);
    else
        if  round(rand())
            knockout1.match(i).winner_prono = knockout1_prono.match(i).team(1);
        else
            knockout1.match(i).winner_prono = knockout1_prono.match(i).team(2);
        end
    end

end

% 4e finales
for i = 1:length(group)/4
    knockout2_prono.match(2*i-1).team(1) = knockout1.match(4*i-3).winner_prono;
    knockout2_prono.match(2*i-1).team(2) = knockout1.match(4*i-1).winner_prono;
        
    knockout2_prono.match(2*i-0).team(1) = knockout1.match(4*i-2).winner_prono;
    knockout2_prono.match(2*i-0).team(2) = knockout1.match(4*i-0).winner_prono;
end
for i = 1:length(knockout2_prono.match)
    knockout2_prono.match(i).score(1) = round( rand()*goalchance(knockout2_prono.match(i).team(1)) );
    knockout2_prono.match(i).score(2) = round( rand()*goalchance(knockout2_prono.match(i).team(2)) );
    
    if knockout2_prono.match(i).score(1) > knockout2_prono.match(i).score(2)
        knockout2.match(i).winner_prono = knockout2_prono.match(i).team(1);
    elseif knockout2_prono.match(i).score(1) < knockout2_prono.match(i).score(2)
         knockout2.match(i).winner_prono = knockout2_prono.match(i).team(2);
    else
        if  round(rand())
            knockout2.match(i).winner_prono = knockout2_prono.match(i).team(1);
        else
            knockout2.match(i).winner_prono = knockout2_prono.match(i).team(2);
        end
    end
 
end

% 2e finales
knockout3_prono.match(1).team(1) = knockout2.match(1).winner_prono;
knockout3_prono.match(1).team(2) = knockout2.match(3).winner_prono;

knockout3_prono.match(2).team(1) = knockout2.match(2).winner_prono;
knockout3_prono.match(2).team(2) = knockout2.match(4).winner_prono;

for i = 1:length(knockout3_prono.match)
    knockout3_prono.match(i).score(1) = round( rand()*goalchance(knockout3_prono.match(i).team(1)) );
    knockout3_prono.match(i).score(2) = round( rand()*goalchance(knockout3_prono.match(i).team(2)) );
    
    if knockout3_prono.match(i).score(1) > knockout3_prono.match(i).score(2)
        knockout3.match(i).winner_prono = knockout3_prono.match(i).team(1);
    elseif knockout3_prono.match(i).score(1) < knockout3_prono.match(i).score(2)
         knockout3.match(i).winner_prono = knockout3_prono.match(i).team(2);
    else
        if  round(rand())
            knockout3.match(i).winner_prono = knockout3_prono.match(i).team(1);
        else
            knockout3.match(i).winner_prono = knockout3_prono.match(i).team(2);
        end
    end
end



% finale
knockout4_prono.match(1).team(1) = knockout3.match(1).winner_prono;
knockout4_prono.match(1).team(2) = knockout3.match(2).winner_prono;

for i = 1:length(knockout4_prono.match)
    knockout4_prono.match(i).score(1) = round( rand()*goalchance(knockout4_prono.match(i).team(1)) );
    knockout4_prono.match(i).score(2) = round( rand()*goalchance(knockout4_prono.match(i).team(2)) );
    
    if knockout4_prono.match(i).score(1) > knockout4_prono.match(i).score(2)
        knockout4.match(i).winner_prono = knockout4_prono.match(i).team(1);
    elseif knockout4_prono.match(i).score(1) < knockout4_prono.match(i).score(2)
         knockout4.match(i).winner_prono = knockout4_prono.match(i).team(2);
    else
        if  round(rand())
            knockout4.match(i).winner_prono = knockout4_prono.match(i).team(1);
        else
            knockout4.match(i).winner_prono = knockout4_prono.match(i).team(2);
        end
    end 
end
%%
%{
knockout1.match(1).winner_prono = group(2).teams(2);
knockout1.match(2).winner_prono = group(2).teams(1);
knockout1.match(3).winner_prono = group(3).teams(1);
knockout1.match(4).winner_prono = group(4).teams(1);
knockout1.match(5).winner_prono = group(5).teams(1);
knockout1.match(6).winner_prono = group(6).teams(1);
knockout1.match(7).winner_prono = group(7).teams(1);
knockout1.match(8).winner_prono = group(8).teams(1);

knockout2.match(1).winner_prono = group(2).teams(2);
knockout2.match(2).winner_prono = group(2).teams(1);
knockout2.match(3).winner_prono = group(7).teams(1);
knockout2.match(4).winner_prono = group(8).teams(1);

knockout3.match(1).winner_prono = group(2).teams(2);
knockout3.match(2).winner_prono = group(8).teams(1);

knockout4.match(1).winner_prono = group(2).teams(2);
%}


for i = 1:length(group)
    group(i).ranking_prono = [1 2];
    
    if group(i).ranking(1) == group(i).ranking_prono(1)
        prono_groep_winnaar = prono_groep_winnaar + 4;
        if group(i).ranking(2) == group(i).ranking_prono(2)
            prono_groep_door = prono_groep_door + 2;
        end
    elseif group(i).ranking(1) == group(i).ranking_prono(2)
        prono_groep_door = prono_groep_door + 2;
        if group(i).ranking(2) == group(i).ranking_prono(1)
            prono_groep_door = prono_groep_door + 2;
        end
    elseif group(i).ranking(2) == group(i).ranking_prono(2)
        prono_groep_door = prono_groep_door + 2;
        
    elseif group(i).ranking(2) == group(i).ranking_prono(1)
        prono_groep_door = prono_groep_door + 2;
    end
    
end


% 8e finale
for i = 1:length(knockout1.match)

    knockout1.match(i).prono(1) = round( rand()*goalchance(knockout1.match(i).team(1)) );
    knockout1.match(i).prono(2) = round( rand()*goalchance(knockout1.match(i).team(2)) );
    
    % pronostiek punten
    if knockout1.match(i).winner == knockout1.match(i).winner_prono
        prono_knockout0 = prono_knockout0 + 18;
    end 
    
    if knockout1.match(i).score(1) == knockout1.match(i).prono(1) && knockout1.match(i).score(2) == knockout1.match(i).prono(2)
        prono_knockout1_uitslag = prono_knockout1_uitslag + 14;
    elseif sign(knockout1.match(i).score(1) - knockout1.match(i).score(2) ) == sign(knockout1.match(i).prono(1) - knockout1.match(i).prono(2) )
        prono_knockout1_uitslag = prono_knockout1_uitslag + 6;
    end
    
end
        

% 4e finale
for i = 1:length(knockout2.match)
    
    knockout2.match(i).prono(1) = round( rand()*goalchance(knockout2.match(i).team(1)) );
    knockout2.match(i).prono(2) = round( rand()*goalchance(knockout2.match(i).team(2)) );
    
    % pronostiek punten
    if knockout2.match(i).winner == knockout2.match(i).winner_prono
        prono_knockout0 = prono_knockout0 + 28;
    end
    
    if knockout2.match(i).score(1) == knockout2.match(i).prono(1) && knockout2.match(i).score(2) == knockout2.match(i).prono(2)
        prono_knockout2_uitslag = prono_knockout2_uitslag + 14;
    elseif sign(knockout2.match(i).score(1) - knockout2.match(i).score(2) ) == sign(knockout2.match(i).prono(1) - knockout2.match(i).prono(2) )
        prono_knockout2_uitslag = prono_knockout2_uitslag + 6;
    end
    
end


% 2e finales
for i = 1:length(knockout3.match)
        
    knockout3.match(i).prono(1) = round( rand()*goalchance(knockout3.match(i).team(1)) );
    knockout3.match(i).prono(2) = round( rand()*goalchance(knockout3.match(i).team(2)) );
    
    % pronostiek punten
    if knockout3.match(i).winner == knockout3.match(i).winner_prono
        prono_knockout0 = prono_knockout0 + 42;
    end
    
    if knockout3.match(i).score(1) == knockout3.match(i).prono(1) && knockout3.match(i).score(2) == knockout3.match(i).prono(2)
        prono_knockout3_uitslag = prono_knockout3_uitslag + 14;
    elseif sign(knockout3.match(i).score(1) - knockout3.match(i).score(2) ) == sign(knockout3.match(i).prono(1) - knockout3.match(i).prono(2) )
        prono_knockout3_uitslag = prono_knockout3_uitslag + 6;
    end
end


% finale
for i = 1:length(knockout4.match)

    knockout4.match(i).prono(1) = round( rand()*goalchance(knockout4.match(i).team(1)) );
    knockout4.match(i).prono(2) = round( rand()*goalchance(knockout4.match(i).team(2)) );
    
    % pronostiek punten
    if knockout4.match(i).winner == knockout4.match(i).winner_prono
        prono_knockout0 = prono_knockout0 + 60;
    end
    
    if knockout4.match(i).score(1) == knockout4.match(i).prono(1) && knockout4.match(i).score(2) == knockout4.match(i).prono(2)
        prono_knockout4_uitslag = prono_knockout4_uitslag + 14;
    elseif sign(knockout4.match(i).score(1) - knockout4.match(i).score(2) ) == sign(knockout4.match(i).prono(1) - knockout4.match(i).prono(2) )
        prono_knockout4_uitslag = prono_knockout4_uitslag + 6;
    end
    
end
        